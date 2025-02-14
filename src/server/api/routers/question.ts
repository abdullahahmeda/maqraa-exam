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
import { enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet } from '~/services/sheet'
import { type QuestionType } from '~/kysely/enums'
import {
  getQuestionsTableList,
  getInfiniteQuestionsList,
  getShowQuestion,
  getExportQuestions,
  deleteQuestions,
  importQuestions,
  loadQuestionsGoogleSheet,
  listRandomQuestions,
} from '~/services/question'
import { filtersSchema } from '~/validation/backend/queries/question'
import { listQuestionSchema } from '~/validation/backend/queries/question/list'
import { infiniteListQuestionSchema } from '~/validation/backend/queries/question/infinite-list'
import { getQuestionSchema } from '~/validation/backend/queries/question/get'
import { listRandomQuestionsSchema } from '~/validation/backend/queries/question/list-random'
import { getAllQuestionStyles } from '~/services/question-style'

export const questionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listQuestionSchema.optional())
    .query(async ({ input }) => {
      const data = await getQuestionsTableList(input)
      return data
    }),

  getTableList: protectedProcedure
    .input(listQuestionSchema.optional())
    .query(async ({ input }) => {
      const data = await getQuestionsTableList(input)
      return data
    }),

  getInfiniteList: protectedProcedure
    .input(infiniteListQuestionSchema.optional())
    .query(async ({ input }) => {
      const data = await getInfiniteQuestionsList(input)
      return data
    }),

  listRandom: publicProcedure
    .input(listRandomQuestionsSchema)
    .query(async ({ input }) => {
      const rows = await listRandomQuestions(input)
      return rows
    }),

  getShow: protectedProcedure
    .input(getQuestionSchema)
    .query(async ({ input }) => {
      const data = await getShowQuestion(input.id)
      return data
    }),

  import: protectedProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ input }) => {
      const { url, sheetName, courseId } = input
      const spreadsheetId = getSpreadsheetIdFromURL(url)!

      const questionStyles = (await getAllQuestionStyles()).reduce(
        (acc, s) => ({ ...acc, [s.name]: s }),
        {},
      ) as Record<
        string,
        { id: string; type: QuestionType; columnChoices: string[] }
      >

      let data
      try {
        data = await loadQuestionsGoogleSheet({
          spreadsheetId,
          sheetName,
          courseId,
          questionStyles
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

      await importQuestions(data)
      return true
    }),

  export: protectedProcedure
    .input(z.object({ filters: filtersSchema }).optional())
    .mutation(async ({ ctx }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      // TODO: implement filtering
      const questions = await getExportQuestions()

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
      if (!ctx.session.user.role.includes('ADMIN'))
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
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteQuestions(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteQuestions(undefined)
    return true
  }),
})
