import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import type { Expression, ExpressionBuilder, SqlBool } from 'kysely'
import { type DB } from '~/kysely/types'
import { TRPCError } from '@trpc/server'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/track/common'
import { listTrackSchema } from '~/validation/backend/queries/track/list'
import { getTrackSchema } from '~/validation/backend/queries/track/get'
import { createTrackSchema } from '~/validation/backend/mutations/track/create'
import { updateTrackSchema } from '~/validation/backend/mutations/track/update'

function applyInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Track'>) => {
    return [
      ...(include?.course
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Course')
                .selectAll('Course')
                .whereRef('Track.courseId', '=', 'Course.id'),
            ).as('course'),
          ]
        : []),
    ]
  }
}

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Track'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.courseId) where.push(eb('courseId', '=', filters.courseId))
    return eb.and(where)
  }
}

export const trackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTrackSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Track').values(input).execute()
      return true
    }),

  update: protectedProcedure
    .input(updateTrackSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.updateTable('Track').set(data).where('id', '=', id).execute()
      return true
    }),

  list: publicProcedure
    .input(listTrackSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Track')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('Track')
          .selectAll()
          .select(applyInclude(input?.include))
          .where(where),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),
  get: protectedProcedure
    .input(getTrackSchema)
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Track')
        .selectAll()
        .where('id', '=', input.id)
        .select(applyInclude(input.include))
        .executeTakeFirst(),
    ),
  // count: protectedProcedure
  //   .input(z.object({ filters: trackFiltersSchema.optional().default({}) }))
  //   .query(async ({ ctx, input }) => {
  //     const query = applyTrackFilters(
  //       ctx.db
  //         .selectFrom('Track')
  //         .select(({ fn }) => fn.count('id').as('total')),
  //       input.filters,
  //     )

  //     const total = Number((await query.executeTakeFirst())?.total)
  //     return total
  //   }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('Track').where('id', '=', input).execute()
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('Track').where('id', 'in', input).execute()
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.deleteFrom('Track').execute()
    return true
  }),
})
