import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { questionSchema } from '~/validation/questionSchema'
import { getSpreadsheetIdFromURL } from '~/utils/strings'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'
import { db } from '~/server/db'
import { enColumnToAr, enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet, importFromGoogleSheet } from '~/services/sheet'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import {
  Expression,
  ExpressionBuilder,
  SelectQueryBuilder,
  Selectable,
  SqlBool,
  sql,
} from 'kysely'
import { CurriculumPart, DB } from '~/kysely/types'
import { numberInput } from '~/validation/common'
import { QuestionService } from '~/services/question'
import {
  filtersSchema,
  includeSchema,
} from '~/validation/backend/queries/question'
import { listQuestionSchema } from '~/validation/backend/queries/question/list'
import { applyPagination } from '~/utils/db'
import { FiltersSchema } from '~/validation/backend/queries/question/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { infiniteListQuestionSchema } from '~/validation/backend/queries/question/infinite-list'
import { getQuestionSchema } from '~/validation/backend/queries/question/get'

async function applyFilters(filters: FiltersSchema | undefined) {
  let curriculumParts: Selectable<CurriculumPart>[] = []
  if (filters?.curriculum !== undefined)
    curriculumParts = await db
      .selectFrom('CurriculumPart')
      .selectAll()
      .where('curriculumId', '=', filters.curriculum.id)
      .execute()
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.id !== undefined) where.push(eb('id', '=', filters.id))
    if (filters?.text !== undefined)
      where.push(eb('text', 'like', '%' + filters.text + '%'))
    if (filters?.isInsideShaded !== undefined)
      where.push(eb('isInsideShaded', '=', filters.isInsideShaded))
    if (filters?.courseId !== undefined)
      where.push(eb('courseId', '=', filters.courseId))
    if (filters?.styleId !== undefined)
      where.push(eb('styleId', '=', filters.styleId))
    if (filters?.type !== undefined) where.push(eb('type', '=', filters.type))
    if (filters?.difficulty !== undefined)
      where.push(eb('difficulty', '=', filters.difficulty))
    if (filters?.number !== undefined)
      where.push(eb('number', '=', filters.number))
    if (filters?.pageNumber !== undefined)
      where.push(eb('pageNumber', '=', filters.pageNumber))
    if (filters?.hadithNumber !== undefined) {
      if (typeof filters.hadithNumber === 'number')
        where.push(eb('hadithNumber', '=', filters.hadithNumber))
      else {
        if (filters.hadithNumber.from)
          where.push(eb('hadithNumber', '<=', filters.hadithNumber.from))
        if (filters.hadithNumber.to)
          where.push(eb('hadithNumber', '>=', filters.hadithNumber.to))
      }
    }

    if (filters?.curriculum !== undefined) {
      if (curriculumParts.length === 0) {
        // empty results
        where.push(sql`1 != 1`)
      } else {
        where.push(
          eb.or(
            curriculumParts.map((part) => {
              let from = part.from
              let to = part.to
              if (filters.curriculum!.type === 'FIRST_MEHWARY') to = part.mid
              else if (filters.curriculum!.type === 'SECOND_MEHWARY')
                from = part.mid
              return eb.and([
                eb('partNumber', '=', part.number),
                eb('hadithNumber', '>=', from),
                eb('hadithNumber', '<=', to),
              ])
            }),
          ),
        )
      }
    }

    if (filters?.partNumber !== undefined)
      where.push(eb('partNumber', '=', filters.partNumber))
    return eb.and(where)
  }
}

function applyInclude<O>(include: z.infer<typeof includeSchema> | undefined) {
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    return [
      ...(include?.course
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Course')
                .selectAll('Course')
                .whereRef('Question.courseId', '=', 'Course.id'),
            ).as('course'),
          ]
        : []),
      ...(include?.style
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('QuestionStyle')
                .selectAll('QuestionStyle')
                .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
            ).as('style'),
          ]
        : []),
    ]
  }
}

export const questionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listQuestionSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = await applyFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Question')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('Question')
          .selectAll()
          .select(applyInclude(input?.include))
          .where(where),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  infiniteList: protectedProcedure
    .input(infiniteListQuestionSchema.optional())
    .query(async ({ ctx, input }) => {
      const limit = 100 // default limit
      const where = await applyFilters(input?.filters)
      let query = ctx.db
        .selectFrom('Question')
        .selectAll()
        .select(applyInclude(input?.include))
        .where(where)
        .limit(limit + 1)
      if (input?.cursor) query = query.where('id', '>', input.cursor)
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const questionService = new QuestionService(ctx.db)
      const rows = await questionService.getRandom(input)
      return rows
    }),

  get: protectedProcedure
    .input(getQuestionSchema)
    .query(async ({ input, ctx }) => {
      const query = ctx.db
        .selectFrom('Question')
        .selectAll('Question')
        .select(applyInclude(input.include))
        .where('Question.id', '=', input.id)

      return query.executeTakeFirst()
    }),

  // count: protectedProcedure
  //   .input(z.object({ filters: filtersSchema.optional() }).optional())
  //   .query(async ({ ctx, input }) => {
  //     const questionService = new QuestionService(ctx.db)
  //     const count = await questionService.getCount(input?.filters)
  //     return count
  //   }),

  import: protectedProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      const { url, sheetName, courseId } = input
      const spreadsheetId = getSpreadsheetIdFromURL(url)!

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
                }),
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
                      style.type,
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
                          column,
                        )}) مطلوب لنوع السؤال ${styleName} لكن قيمته فارغة في الإكسل`,
                      })
                  }
                  if (!answerIsInChoices)
                    return ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: 'الإجابة الصحيحة ليست موجودة في الإختيارات',
                    })
                }
              },
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
              ${rows[18]}::text[])`.as('T') as any,
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
