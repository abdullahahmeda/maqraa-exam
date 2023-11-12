import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { newTrackSchema } from '~/validation/newTrackSchema'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import { TRPCError } from '@trpc/server'

const trackFilterSchema = z.object({
  courseId: z.string().optional(),
})

function applyTrackFilters<O>(
  query: SelectQueryBuilder<DB, 'Track', O>,
  filters: z.infer<typeof trackFilterSchema>
) {
  return applyFilters(query, filters)
}

export const trackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newTrackSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insertInto('Track').values(input).execute()
      return true
    }),

  list: protectedProcedure
    .input(
      z.object({
        filters: trackFilterSchema.optional().default({}),
        include: z
          .record(z.literal('course'), z.boolean().optional())
          .optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .selectFrom('Track')
        .selectAll('Track')
        .$if(!!input.include?.course, (qb) =>
          qb
            .leftJoin('Course', 'Track.courseId', 'Course.id')
            .select('Course.name as courseName')
        )

      return await applyPagination(
        applyTrackFilters(query, input.filters),
        input.pagination
      ).execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: trackFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applyTrackFilters(
        ctx.db
          .selectFrom('Track')
          .select(({ fn }) => fn.count('id').as('total')),
        input.filters
      )

      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('Track').where('id', '=', input).execute()
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

      await ctx.db.deleteFrom('Track').where('id', 'in', input).execute()
      return true
    }),
})
