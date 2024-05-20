import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createCourseSchema } from '~/validation/backend/mutations/course/create'
import { getCourseSchema } from '~/validation/backend/queries/course/get'
import { listCourseSchema } from '~/validation/backend/queries/course/list'
import { updateCourseSchema } from '~/validation/backend/mutations/course/update'
import { type FiltersSchema } from '~/validation/backend/queries/course/common'
import type { Expression, ExpressionBuilder, SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Course'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCourseSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Course').values(input).execute()
      return true
    }),

  get: protectedProcedure
    .input(getCourseSchema)
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Course')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst(),
    ),

  list: publicProcedure
    .input(listCourseSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Course')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db.selectFrom('Course').selectAll().where(where),
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
  //     .selectFrom('Course')
  //     .select(({ fn }) => fn.count('id').as('total'))

  //   const total = Number((await query.executeTakeFirst())?.total)
  //   return total
  // }),

  update: protectedProcedure
    .input(updateCourseSchema)
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

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('Course').where('id', 'in', input).execute()
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.deleteFrom('Course').execute()
    return true
  }),
})
