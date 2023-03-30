import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { sendGradeEmail } from '../../../services/exams'
import { logErrorToLogtail } from '../../../utils/logtail'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const emailsrouter = createTRPCRouter({
  sendGradeEmail: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1)
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendGradeEmail(input.id)
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
