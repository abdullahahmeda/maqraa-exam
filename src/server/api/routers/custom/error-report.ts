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
import { TRPCError } from '@trpc/server'

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
      .leftJoin(
        'ModelQuestion',
        'ErrorReport.modelQuestionId',
        'ModelQuestion.id'
      )
      .leftJoin('Question', 'ModelQuestion.questionId', 'Question.id')
      .select([
        'Question.id as questionId',
        'Question.number as questionNumber',
        'Question.partNumber as questionPartNumber',
        'Question.pageNumber as questionPageNumber',
      ])
  )
}

export const errorReportRouter = createTRPCRouter({
  create: publicProcedure
    .input(reportErrorSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session)
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
            .selectAll('ErrorReport')
            .leftJoin('User', 'ErrorReport.userId', 'User.id')
            .select((eb) => [
              eb
                .case()
                .when('ErrorReport.userId', 'is not', null)
                .then(eb.ref('User.name'))
                .else(eb.ref('ErrorReport.name'))
                .end()
                .as('userName'),
              eb
                .case()
                .when('ErrorReport.userId', 'is not', null)
                .then(eb.ref('User.email'))
                .else(eb.ref('ErrorReport.email'))
                .end()
                .as('userEmail'),
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
