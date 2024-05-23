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
import { applyCoursesFilters, deleteCourses } from '~/services/course'

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
      const where = applyCoursesFilters(input?.filters)

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
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteCourses(input)
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

      await deleteCourses(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCourses(undefined)
    return true
  }),
})
