import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import { TRPCError } from '@trpc/server'
import { type FiltersSchema } from '~/validation/backend/queries/cycle/common'
import type { Expression, ExpressionBuilder, SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { createCycleSchema } from '~/validation/backend/mutations/cycle/create'
import { updateCycleSchema } from '~/validation/backend/mutations/cycle/update'
import { listCycleSchema } from '~/validation/backend/queries/cycle/list'
import { getCycleSchema } from '~/validation/backend/queries/cycle/get'

function applyFilters(filters: FiltersSchema | undefined) {
  const where: Expression<SqlBool>[] = []

  return (eb: ExpressionBuilder<DB, 'Cycle'>) => {
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export const cycleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCycleSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Cycle').values(input).execute()
      return true
    }),

  get: protectedProcedure
    .input(getCycleSchema)
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Cycle')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst(),
    ),

  list: protectedProcedure
    .input(listCycleSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Cycle')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db.selectFrom('Cycle').selectAll().where(where),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  // count: protectedProcedure.query(async ({ ctx, input }) => {
  //   const query = ctx.db
  //     .selectFrom('Cycle')
  //     .select(({ fn }) => fn.count('id').as('total'))

  //   const total = Number((await query.executeTakeFirst())?.total)
  //   return total
  // }),

  update: protectedProcedure
    .input(updateCycleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.updateTable('Cycle').set(data).where('id', '=', id).execute()
      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.deleteFrom('Cycle').where('id', '=', input).execute()
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('Cycle').where('id', 'in', input).execute()
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.deleteFrom('Cycle').execute()
    return true
  }),
})
