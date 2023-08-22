import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { checkRead, db } from './helper'

export const studentsRouter = createTRPCRouter({
  getOverallPerformance: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input, ctx }) => {
      const student = await checkRead(
        db(ctx).student.findFirstOrThrow({ where: { id: input } })
      )

      return student.getOverallPerformance()
    }),
})
