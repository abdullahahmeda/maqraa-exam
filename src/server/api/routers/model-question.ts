import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import type { ExpressionBuilder, SelectQueryBuilder } from 'kysely'
import type { DB } from '~/kysely/types'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

const includeSchema = z.object({
  question: z.boolean().optional(),
})

type Include = z.infer<typeof includeSchema>

function withQuestion(eb: ExpressionBuilder<DB, 'ModelQuestion'>) {
  return jsonObjectFrom(
    eb
      .selectFrom('Question')
      .selectAll('Question')
      .whereRef('ModelQuestion.questionId', '=', 'Question.id'),
  ).as('question')
}

function applyInclude<O>(
  query: SelectQueryBuilder<DB, 'ModelQuestion', O>,
  include: Include | undefined,
) {
  if (include === undefined) return query
  return query.$if(!!include.question, (qb) => qb.select(withQuestion))
}

export const modelQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), include: includeSchema.optional() }))
    .query(async ({ input, ctx }) => {
      const query = applyInclude(
        ctx.db
          .selectFrom('ModelQuestion')
          .selectAll()
          .where('id', '=', input.id),
        input.include,
      )

      return query.executeTakeFirst()
    }),
})
