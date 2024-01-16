import { ZodError, z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { questionSchema } from '~/validation/questionSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'
import { db } from '~/server/db'
import XLSX from 'xlsx'
import { enColumnToAr, enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet, importFromGoogleSheet } from '~/services/sheet'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'

const questionFilterSchema = z.object({
  id: z.string().optional(),
  number: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  partNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  pageNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  hadithNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  courseId: z.string().optional(),
  text: z.string().optional(),
  curriculum: z
    .object({
      id: z.string(),
      type: z.nativeEnum(QuizType),
    })
    .optional(),
  type: z.nativeEnum(QuestionType).optional(),
  styleId: z.string().optional(),
  isInsideShaded: z.boolean().optional(),
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
})

function applyQuestionFilters<O>(
  query: SelectQueryBuilder<DB, 'Question', O>,
  filters: z.infer<typeof questionFilterSchema>
) {
  return applyFilters(query, filters, {
    id: (query, id) => query.where('Question.id', '=', id as string),
    curriculum: (query, curriculum) => query, // Custom handler below in `list`
    text: (query, text) => query.where('text', 'like', `%${text}%`),
  })
}

const includeSchema = z.record(
  z.union([z.literal('course'), z.literal('style')]),
  z.boolean().optional()
)

function withCourse<O>(qb: SelectQueryBuilder<DB, 'Question', O>) {
  return qb
    .leftJoin('Course', 'Question.courseId', 'Course.id')
    .select('Course.name as courseName')
}

function withStyle<O>(qb: SelectQueryBuilder<DB, 'Question', O>) {
  return qb
    .leftJoin('QuestionStyle', 'Question.styleId', 'QuestionStyle.id')
    .select('QuestionStyle.name as styleName')
}

function applyInclude<O>(
  query: SelectQueryBuilder<DB, 'Question', O>,
  include: z.infer<typeof includeSchema> | undefined
) {
  return query
    .$if(!!include?.course, withCourse)
    .$if(!!include?.style, withStyle)
}

export const questionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        filters: questionFilterSchema,
        include: includeSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = applyInclude(
        applyPagination(
          applyQuestionFilters(
            ctx.db.selectFrom('Question').selectAll('Question'),
            input.filters
          ),
          input.pagination
        ),
        input.include
      )

      if (input.filters.curriculum) {
        const parts = await db
          .selectFrom('CurriculumPart')
          .where('curriculumId', '=', input.filters.curriculum.id)
          .select(['from', 'mid', 'to', 'number'])
          .execute()

        const courseId = await db
          .selectFrom('Curriculum')
          .where('Curriculum.id', '=', input.filters.curriculum.id)
          .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
          .leftJoin('Course', 'Track.courseId', 'Course.id')
          .select('Course.id')
          .executeTakeFirst()

        query = query.where((eb) =>
          eb.or(
            parts.map((part) => {
              let minLimit: number
              let maxLimit: number
              switch (input.filters.curriculum!.type) {
                case 'FIRST_MEHWARY':
                  minLimit = part.from
                  maxLimit = part.mid
                  break
                case 'SECOND_MEHWARY':
                  minLimit = Math.max(part.from, part.mid)
                  maxLimit = part.to
                  break
                case 'WHOLE_CURRICULUM':
                  minLimit = part.from
                  maxLimit = part.to
                  break
              }
              return eb.and([
                eb('hadithNumber', '>=', minLimit),
                eb('hadithNumber', '<=', maxLimit),
                eb('partNumber', '=', part.number),
                eb('courseId', '=', courseId!.id),
              ])
            })
          )
        )
      }

      return await query.execute()
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string(), include: includeSchema.optional() }))
    .query(async ({ input, ctx }) => {
      const query = applyInclude(
        ctx.db
          .selectFrom('Question')
          .selectAll('Question')
          .where('Question.id', '=', input.id),
        input.include
      )

      return query.executeTakeFirst()
    }),

  count: protectedProcedure
    .input(z.object({ filters: questionFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applyQuestionFilters(
        ctx.db
          .selectFrom('Question')
          .select(({ fn }) => fn.count<number>('id').as('total')),
        input.filters
      )
      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),
  import: protectedProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      const { url, sheetName, courseId } = input
      const spreadsheetId = getSpreadsheetIdFromURL(url) as string

      const questionStyles = (
        await db.selectFrom('QuestionStyle').selectAll().execute()
      ).reduce((acc, s) => ({ ...acc, [s.name]: s }), {}) as Record<
        string,
        { id: string; type: QuestionType; columnChoices: string[] }
      >

      let data
      try {
        data = await importFromGoogleSheet({
          spreadsheetId,
          sheetName,
          mapper: (row) => ({
            number: row[0],
            pageNumber: row[1],
            partNumber: row[2],
            hadithNumber: row[3],
            type: row[4],
            styleName: row[5],
            difficulty: row[6],
            text: row[7],
            textForTrue: row[8],
            textForFalse: row[9],
            option1: row[10],
            option2: row[11],
            option3: row[12],
            option4: row[13],
            answer: row[14],
            anotherAnswer: row[15],
            isInsideShaded: row[16],
            objective: row[17],
            courseId,
            questionStyles,
          }),
          validationSchema: questionSchema
            .extend({
              questionStyles: z.record(
                z.object({
                  name: z.string(),
                  type: z.nativeEnum(QuestionType),
                  choicesColumns: z.union([
                    z.array(z.string()),
                    z.literal(null),
                  ]),
                })
              ),
            })
            .superRefine(
              ({ questionStyles, styleName, type, answer, ...obj }, ctx) => {
                const style = questionStyles[styleName]
                if (!style)
                  return ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `السؤال من نوع (${styleName}) غير موجود في قاعدة البيانات`,
                  })
                if (style.type !== type)
                  return ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `السؤال من نوع (${styleName}) يجب أن يكون ${enTypeToAr(
                      style.type
                    )} لكنه في الإكسل (${enTypeToAr(type)})`,
                  })

                if (type === 'MCQ') {
                  let answerIsInChoices = false
                  for (const column of style.choicesColumns!) {
                    const field = obj[column as keyof typeof obj] as string
                    if (field === answer) {
                      if (answerIsInChoices)
                        return ctx.addIssue({
                          code: z.ZodIssueCode.custom,
                          message: 'الإجابة الصحيحة موجودة في أكثر من خيار',
                        })
                      answerIsInChoices = true
                    }
                    if (field == undefined || field === '')
                      return ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `الحقل (${enColumnToAr(
                          column
                        )}) مطلوب لنوع السؤال ${styleName} لكن قيمته فارغة في الإكسل`,
                      })
                  }
                  if (!answerIsInChoices)
                    return ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: 'الإجابة الصحيحة ليست موجودة في الإختيارات',
                    })
                }
              }
            )
            .transform((d) => ({
              ...d,
              questionStyles: undefined,
              styleName: undefined,
              styleId: questionStyles[
                d.styleName as keyof typeof questionStyles
              ]!.id as string,
            })),
        })
      } catch (error) {
        if (error instanceof GaxiosError) {
          if (Number(error.code) === 404) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'هذا الملف غير موجود',
            })
          }
          if (Number(error.code) === 403 || Number(error.code) === 400) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'الصلاحيات غير كافية، تأكد من تفعيل مشاركة الملف',
            })
          }
        }

        if (error instanceof ZodError) {
          const issue = error.issues[0]!
          const [rowNumber, field] = issue.path

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `خطأ في الصف رقم ${rowNumber}: ${issue.message}`,
            cause: issue,
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع',
        })
      }

      await ctx.db.insertInto('Question').values(data).execute()
      return true
    }),

  export: protectedProcedure
    .input(z.object({ filters: questionFilterSchema }).optional())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const questions = await ctx.db
        .selectFrom('Question')
        .leftJoin('QuestionStyle', 'Question.styleId', 'QuestionStyle.id')
        .selectAll('Question')
        .select('QuestionStyle.name as styleName')
        .orderBy('number asc')
        .execute()

      return exportSheet(questions, (q) => ({
        'رقم السؤال': q.number,
        'رقم الصفحة': q.pageNumber,
        'رقم الجزء': q.partNumber,
        'رقم الحديث': q.hadithNumber,
        'نوع السؤال': enTypeToAr(q.type),
        'طريقة السؤال': q.styleName,
        'مستوى السؤال': enDifficultyToAr(q.difficulty),
        السؤال: q.text,
        صح: q.textForTrue,
        خطأ: q.textForFalse,
        خيار1: q.option1,
        خيار2: q.option2,
        خيار3: q.option3,
        خيار4: q.option4,
        الإجابة: q.answer,
        'هل يوجد إجابة أخرى': q.anotherAnswer,
        'داخل المظلل': q.isInsideShaded ? 'نعم' : 'لا',
        'يستهدف السؤال': q.objective,
      }))
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.deleteFrom('Question').where('id', '=', input).execute()
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('Question').where('id', 'in', input).execute()
      return true
    }),
})
