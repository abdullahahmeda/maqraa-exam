import { z } from 'zod'
import { getPaginatedQuestions } from '../../../services/questions'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const questionsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().positive().int().optional()
      })
    )
    .query(async ({ input }) => {
      const pageSize = 50
      const page = input.page || 1

      return await getPaginatedQuestions({ page, pageSize })
    })
})
