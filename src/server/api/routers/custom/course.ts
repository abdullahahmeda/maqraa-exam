import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { editCourseSchema } from '~/validation/editCourseSchema'
import { applyPagination, paginationSchema } from '~/utils/db'
import { z } from 'zod'

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCourseSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Course').values(input).execute()
      return true
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Course')
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
        ctx.db.selectFrom('Course').select(['id', 'name']),
        input.pagination
      )
      return await query.execute()
    }),
  count: protectedProcedure.query(async ({ ctx, input }) => {
    const query = ctx.db
      .selectFrom('Course')
      .select(({ fn }) => fn.count('id').as('total'))

    const total = Number((await query.executeTakeFirst())?.total)
    return total
  }),

  update: protectedProcedure
    .input(editCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db
        .updateTable('Course')
        .set(data)
        .where('id', '=', id)
        .execute()
      return true
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('Course').where('id', '=', input).execute()
      return true
    }),
})
