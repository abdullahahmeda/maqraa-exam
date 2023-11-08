import { reportErrorSchema } from '~/validation/reportErrorSchema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { applyPagination, paginationSchema } from '~/utils/db'
import { z } from 'zod'

export const errorReportRouter = createTRPCRouter({
  reportError: publicProcedure
    .input(reportErrorSchema)
    .mutation(async ({ ctx, input }) => {
      return db.errorReport.create({
        data: input,
      })
    }),

  list: protectedProcedure
    .input(
      z.object({
        include: z
          .record(z.literal('question'), z.boolean().optional())
          .optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = applyPagination(
        ctx.db
          .selectFrom('ErrorReport')
          .select(['ErrorReport.name', 'ErrorReport.email', 'ErrorReport.note'])
          .$if(!!input.include?.question, (qb) =>
            qb
              .leftJoin('Question', 'ErrorReport.questionId', 'Question.id')
              .select([
                'Question.number as questionNumber',
                'Question.partNumber as questionPartNumber',
                'Question.pageNumber as questionPageNumber',
              ])
          ),
        input.pagination
      )
      return await query.execute()
    }),
  count: protectedProcedure.query(async ({ ctx, input }) => {
    const query = ctx.db
      .selectFrom('ErrorReport')
      .select(({ fn }) => fn.count('id').as('total'))

    const total = Number((await query.executeTakeFirst())?.total)
    return total
  }),
})
