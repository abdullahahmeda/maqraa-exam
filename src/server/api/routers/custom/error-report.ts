import { reportErrorSchema } from '~/validation/reportErrorSchema'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'

export const errorReportRouter = createTRPCRouter({
  reportError: publicProcedure
    .input(reportErrorSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.errorReport.create({
        data: input,
      })
    }),
})
