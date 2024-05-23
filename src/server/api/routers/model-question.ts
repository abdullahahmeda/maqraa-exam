import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import type { ExpressionBuilder } from 'kysely'
import type { DB } from '~/kysely/types'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

const includeSchema = z.object({
  question: z.boolean().optional(),
})

type Include = z.infer<typeof includeSchema>

export function applyInclude(include: Include | undefined) {
  return (eb: ExpressionBuilder<DB, 'ModelQuestion'>) => {
    return [
      ...(include?.question
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Question')
                .selectAll('Question')
                .whereRef('ModelQuestion.questionId', '=', 'Question.id'),
            ).as('question'),
          ]
        : []),
    ]
  }
}

export const modelQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), include: includeSchema.optional() }))
    .query(async ({ input, ctx }) => {
      const query = ctx.db
        .selectFrom('ModelQuestion')
        .selectAll('ModelQuestion')
        .select(applyInclude(input.include))
        .where('id', '=', input.id)

      return query.executeTakeFirst()
    }),
})
