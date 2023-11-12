import { reportErrorSchema } from '~/validation/reportErrorSchema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { applyPagination, paginationSchema } from '~/utils/db'
import { z } from 'zod'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'

const errorReportIncludeSchema = z.record(
  z.literal('question'),
  z.boolean().optional()
)

function applyErrorReportIncludes<O>(
  query: SelectQueryBuilder<DB, 'ErrorReport', O>,
  includes: z.infer<typeof errorReportIncludeSchema> | undefined
) {
  return query.$if(!!includes?.question, (qb) =>
    qb
      .leftJoin('Question', 'ErrorReport.questionId', 'Question.id')
      .select([
        'Question.number as questionNumber',
        'Question.partNumber as questionPartNumber',
        'Question.pageNumber as questionPageNumber',
      ])
  )
}

export const errorReportRouter = createTRPCRouter({
  reportError: publicProcedure
    .input(reportErrorSchema)
    .mutation(async ({ ctx, input }) => {
      await db.insertInto('ErrorReport').values(input).execute()
      return true
    }),

  list: protectedProcedure
    .input(
      z.object({
        include: errorReportIncludeSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = applyErrorReportIncludes(
        applyPagination(
          ctx.db
            .selectFrom('ErrorReport')
            .select([
              'ErrorReport.name',
              'ErrorReport.email',
              'ErrorReport.note',
            ]),
          input.pagination
        ),
        input.include
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
