import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { getSpreadsheetIdFromURL } from '~/utils/strings'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'
import { db } from '~/server/db'
import { enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet, importFromGoogleSheet } from '~/services/sheet'
import { type QuestionType } from '~/kysely/enums'
import { type AnyColumn, sql } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  applyQuestionsFilters,
  applyQuestionsInclude,
  deleteQuestions,
  listRandomQuestions,
} from '~/services/question'
import { filtersSchema } from '~/validation/backend/queries/question'
import { listQuestionSchema } from '~/validation/backend/queries/question/list'
import { applyPagination } from '~/utils/db'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { infiniteListQuestionSchema } from '~/validation/backend/queries/question/infinite-list'
import { getQuestionSchema } from '~/validation/backend/queries/question/get'
import { importedQuestionSchema } from '~/validation/importedQuestionSchema'
import { listRandomQuestionsSchema } from '~/validation/backend/queries/question/list-random'

export const questionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listQuestionSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = await applyQuestionsFilters(input?.filters)

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
          .select(applyQuestionsInclude(input?.include))
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
      const where = await applyQuestionsFilters(input?.filters)
      let query = ctx.db
        .selectFrom('Question')
        .selectAll()
        .select(applyQuestionsInclude(input?.include))
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
    .input(listRandomQuestionsSchema)
    .query(async ({ input }) => {
      const rows = await listRandomQuestions(input)
      return rows
    }),

  get: protectedProcedure
    .input(getQuestionSchema)
    .query(async ({ input, ctx }) => {
      const query = ctx.db
        .selectFrom('Question')
        .selectAll('Question')
        .select(applyQuestionsInclude(input.include))
        .where('Question.id', '=', input.id)

      return query.executeTakeFirst()
    }),

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
          validationSchema: importedQuestionSchema.transform((d) => ({
            ...d,
            questionStyles: undefined,
            styleName: undefined,
            styleId: questionStyles[d.styleName]!.id,
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

      const columns: AnyColumn<DB, 'Question'>[] = [
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

      const rows = columns.map((col) =>
        data.map((d) => d[col as keyof typeof d]),
      )

      await ctx.db
        .insertInto('Question')
        .columns(columns)
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
              ${rows[18]}::text[])`,
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

      const questions = await ctx.db
        .selectFrom('Question')
        .selectAll('Question')
        .select((eb) =>
          jsonObjectFrom(
            eb
              .selectFrom('QuestionStyle')
              .selectAll('QuestionStyle')
              .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
          ).as('style'),
        )
        .orderBy('number asc')
        .execute()

      return exportSheet(questions, (q) => ({
        'رقم السؤال': q.number,
        'رقم الصفحة': q.pageNumber,
        'رقم الجزء': q.partNumber,
        'رقم الحديث': q.hadithNumber,
        'نوع السؤال': enTypeToAr(q.type),
        'طريقة السؤال': q.style?.name,
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

      await deleteQuestions(input)
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

      await deleteQuestions(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteQuestions(undefined)
    return true
  }),
})
