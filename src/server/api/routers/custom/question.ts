import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { questionSchema } from '~/validation/questionSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'
import { db } from '~/server/db'
import { enColumnToAr, enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet, importFromGoogleSheet } from '~/services/sheet'
import { paginationSchema } from '~/utils/db'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import { SelectQueryBuilder, sql } from 'kysely'
import { DB } from '~/kysely/types'
import { numberInput } from '~/validation/common'
import { QuestionService } from '~/services/question'
import { filtersSchema, includeSchema } from '~/validation/queries/question'

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
        filters: filtersSchema,
        include: includeSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const questionService = new QuestionService(ctx.db)
      const count = await questionService.getCount(input?.filters)

      let query = await questionService.getListQuery({
        filters: input?.filters,
        include: input?.include,
      })
      if (input?.pagination) {
        const { pageSize, pageIndex } = input.pagination
        query = query.limit(pageSize).offset(pageIndex * pageSize)
      }
      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  infiniteList: protectedProcedure
    .input(
      z
        .object({
          cursor: z.string().optional(),
          filters: filtersSchema.optional(),
          include: includeSchema.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = 100 // default limit
      const questionService = new QuestionService(ctx.db)
      const query = await questionService.getListQuery({
        limit: limit + 1,
        filters: input?.filters,
        cursor: input?.cursor,
        include: input?.include,
      })

      const questions = await query.execute()

      let nextCursor: string | undefined = undefined
      if (questions.length > limit) {
        const nextItem = questions.pop() as { id: string }
        nextCursor = nextItem.id
      }

      return {
        data: questions,
        nextCursor,
      }
    }),

  listRandom: publicProcedure
    .input(
      z.object({
        limit: numberInput.pipe(z.number().positive().safe()),
        filters: z.object({
          difficulty: z
            .nativeEnum(QuestionDifficulty)
            .or(z.literal('').transform(() => undefined))
            .optional(),
          type: z
            .nativeEnum(QuestionType)
            .or(z.literal('').transform(() => undefined))
            .optional(),
          isInsideShaded: z
            .boolean()
            .or(z.literal('').transform(() => undefined))
            .optional(),
          courseId: z
            .string()
            .or(z.literal('').transform(() => undefined))
            .optional(),
          curriculum: z
            .object({
              id: z.string(),
              type: z
                .nativeEnum(QuizType)
                .or(z.literal('').transform(() => undefined))
                .optional()
                .default(QuizType.WHOLE_CURRICULUM),
            })
            .optional(),
        }),
        include: includeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const questionService = new QuestionService(ctx.db)
      const rows = await questionService.getRandom(input)
      return rows
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
    .input(z.object({ filters: filtersSchema.optional() }).optional())
    .query(async ({ ctx, input }) => {
      const questionService = new QuestionService(ctx.db)
      const count = await questionService.getCount(input?.filters)
      return count
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

      let data: any[]
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

      const columns = [
        'number',
        'pageNumber',
        'partNumber',
        'hadithNumber',
        'type',
        'styleId',
        'difficulty',
        'text',
        'textForTrue',
        'textForFalse',
        'option1',
        'option2',
        'option3',
        'option4',
        'answer',
        'anotherAnswer',
        'isInsideShaded',
        'objective',
        'courseId',
      ]

      const rows = columns.map((col) => data.map((d) => d[col]))

      await ctx.db
        .insertInto('Question')
        .columns(columns as any[])
        .expression(
          () =>
            sql`select * from unnest(
              ${rows[0]}::integer[], 
              ${rows[1]}::integer[],
              ${rows[2]}::integer[],
              ${rows[3]}::integer[],
              ${rows[4]}::"QuestionType"[],
              ${rows[5]}::text[],
              ${rows[6]}::"QuestionDifficulty"[],
              ${rows[7]}::text[],
              ${rows[8]}::text[],
              ${rows[9]}::text[],
              ${rows[10]}::text[],
              ${rows[11]}::text[],
              ${rows[12]}::text[],
              ${rows[13]}::text[],
              ${rows[14]}::text[],
              ${rows[15]}::text[],
              ${rows[16]}::boolean[],
              ${rows[17]}::text[],
              ${rows[18]}::text[])`.as('T') as any
        )
        .execute()
      return true
    }),

  export: protectedProcedure
    .input(z.object({ filters: filtersSchema }).optional())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const questionService = new QuestionService(ctx.db)
      const questions = await questionService.getList({
        include: { style: true },
        orderBy: {
          expression: 'number',
        },
      })

      return exportSheet(questions, (q) => ({
        'رقم السؤال': q.number,
        'رقم الصفحة': q.pageNumber,
        'رقم الجزء': q.partNumber,
        'رقم الحديث': q.hadithNumber,
        'نوع السؤال': enTypeToAr(q.type),
        'طريقة السؤال': (q as any).style.name,
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
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const questionService = new QuestionService(ctx.db)
      await questionService.delete(input)
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

      const questionService = new QuestionService(ctx.db)
      await questionService.delete(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    const questionService = new QuestionService(ctx.db)
    await questionService.delete(undefined)
    return true
  }),
})
