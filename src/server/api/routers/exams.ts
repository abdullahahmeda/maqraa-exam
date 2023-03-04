import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createExam, getExamToSolve, submitExam } from '../../../services/exams'
import { logErrorToLogtail } from '../../../utils/logtail'
import { newExamSchema } from '../../../validation/newExamSchema'
import { prisma } from '../../db'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const examsRouter = createTRPCRouter({
  get: publicProcedure
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
      exam = await createExam(input.difficulty)
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
    })
})
