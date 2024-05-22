import { reportErrorSchema } from '~/validation/reportErrorSchema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { applyPagination } from '~/utils/db'
import { z } from 'zod'
import { type ExpressionBuilder } from 'kysely'
import type { DB } from '~/kysely/types'
import { TRPCError } from '@trpc/server'
import { listErrorReportsSchema } from '~/validation/backend/queries/error-report/list'
import { type IncludeSchema } from '~/validation/backend/queries/error-report/common'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

function applyInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'ErrorReport'>) => {
    return [
      ...(include?.modelQuestion
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('ModelQuestion')
                .selectAll('ModelQuestion')
                .select((eb) => [
                  ...(typeof include.modelQuestion !== 'boolean' &&
                  include.modelQuestion?.question
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Question')
                            .selectAll('Question')
                            .whereRef(
                              'ModelQuestion.questionId',
                              '=',
                              'Question.id',
                            ),
                        ).as('question'),
                      ]
                    : []),
                ])
                .whereRef(
                  'ErrorReport.modelQuestionId',
                  '=',
                  'ModelQuestion.id',
                ),
            ).as('modelQuestion'),
          ]
        : []),
      ...(include?.user
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('User')
                .selectAll('User')
                .whereRef('ErrorReport.userId', '=', 'User.id'),
            ).as('user'),
          ]
        : []),
    ]
  }
}

export const errorReportRouter = createTRPCRouter({
  create: publicProcedure
    .input(reportErrorSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await db
          .insertInto('ErrorReport')
          .values({
            ...input,
            userId: ctx.session.user.id,
          })
          .execute()
      } else {
        if ('email' in input) {
          await db.insertInto('ErrorReport').values(input).execute()
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'يجب تسجيل الدخول أو تعبئة الحقول',
          })
        }
      }
      return true
    }),

  list: protectedProcedure
    .input(listErrorReportsSchema.optional())
    .query(async ({ ctx, input }) => {
      const count = Number(
        (
          await ctx.db
            .selectFrom('ErrorReport')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('ErrorReport')
          .selectAll('ErrorReport')
          .select(applyInclude(input?.include)),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('ErrorReport').where('id', '=', input).execute()
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('ErrorReport').where('id', 'in', input).execute()
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.deleteFrom('ErrorReport').execute()
    return true
  }),
})
