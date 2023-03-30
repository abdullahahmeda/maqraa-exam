import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { QuestionDifficulty } from '../../../constants'
import {
  createExam,
  deleteExam,
  getExam,
  getExamToSolve,
  getPaginatedExams,
  saveExam,
  sendGradeEmail,
  submitExam
} from '../../../services/exams'
import { sendMail } from '../../../utils/email'
import { logErrorToLogtail } from '../../../utils/logtail'
import { newExamSchema } from '../../../validation/newExamSchema'
import { prisma } from '../../db'
import { createTRPCRouter, publicProcedure } from '../trpc'

const filtersSchema = z
  .object({
    graded: z
      .union([z.literal(''), z.literal('yes'), z.literal('no')])
      .optional(),
    grade: z.union([z.literal(''), z.number().int().nonnegative()]).optional(),
    difficulty: z
      .union([z.literal(''), z.nativeEnum(QuestionDifficulty)])
      .optional()
  })
  .optional()

export type FilterSchema = z.infer<typeof filtersSchema>

export const examsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().positive().int().optional(),
        filters: filtersSchema
      })
    )
    .query(async ({ input }) => {
      const pageSize = 50
      const page = input.page || 1
      const filters: Required<FilterSchema> = {
        graded: '',
        grade: '',
        difficulty: '',
        ...input.filters
      }!

      return await getPaginatedExams({ page, pageSize, filters })
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1)
      })
    )
    .query(async ({ input }) => {
      let exam
      try {
        exam = await getExam(input.id)
      } catch (error) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return exam
    }),
  getToSolve: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1)
      })
    )
    .query(async ({ input }) => {
      let exam
      try {
        exam = await getExamToSolve(input.id)
      } catch (error) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }

      if (!exam)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'هذا الاختبار غير موجود'
        })

      return exam
    }),
  create: publicProcedure.input(newExamSchema).mutation(async ({ input }) => {
    let exam
    try {
      exam = await createExam(input.difficulty, input.course, input.curriculum)
    } catch (error) {
      logErrorToLogtail(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'حدث خطأ غير متوقع'
      })
    }
    return exam
  }),

  submit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
        answers: z.record(z.string().nullable())
      })
    )
    .mutation(async ({ input }) => {
      const exam = await prisma.exam.findFirst({
        where: {
          id: input.id
        }
      })

      if (!exam)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'هذا الاختبار غير موجود'
        })

      if (exam.submittedAt)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار تم تسليمه من قبل'
        })

      try {
        await submitExam(input.id, input.answers)
      } catch (error: any) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    }),
  save: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
        questions: z.record(z.boolean())
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveExam(input.id, input.questions)
      } catch (error: any) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      let isEmailSent = true
      try {
        await sendGradeEmail(input.id)
      } catch (error) {
        isEmailSent = false
        logErrorToLogtail(error)
      }
      return isEmailSent
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1)
      })
    )
    .mutation(async ({ input }) => {
      try {
        await deleteExam(input.id)
      } catch (error) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    })
})
