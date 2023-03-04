import { z } from 'zod'
import { prisma } from '../../db'

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

      return {
        questions: await prisma.question.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize
        }),
        count: await prisma.question.count()
      }
    })
})
