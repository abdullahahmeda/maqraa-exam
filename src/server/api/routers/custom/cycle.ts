import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { editCycleSchema } from '~/validation/editCycleSchema'
import { applyPagination, paginationSchema } from '~/utils/db'
import { TRPCError } from '@trpc/server'

export const cycleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCycleSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Cycle').values(input).execute()
      return true
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Cycle')
        .selectAll()
        .where('id', '=', input)
        .executeTakeFirst()
    ),

  list: protectedProcedure
    .input(
      z.object({
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = applyPagination(
        ctx.db.selectFrom('Cycle').selectAll(),
        input.pagination
      )
      return await query.execute()
    }),

  count: protectedProcedure.query(async ({ ctx, input }) => {
    const query = ctx.db
      .selectFrom('Cycle')
      .select(({ fn }) => fn.count('id').as('total'))

    const total = Number((await query.executeTakeFirst())?.total)
    return total
  }),

  update: protectedProcedure
    .input(editCycleSchema)
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
