import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import { TRPCError } from '@trpc/server'

import { createCycleBackendSchema } from '~/validation/backend/mutations/cycle/create'
import { updateCycleBackendSchema } from '~/validation/backend/mutations/cycle/update'
import { listCycleSchema } from '~/validation/backend/queries/cycle/list'
import { getCycleSchema } from '~/validation/backend/queries/cycle/get'
import {
  applyCyclesFilters,
  applyCyclesInclude,
  deleteCycles,
} from '~/services/cycle'

export const cycleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCycleBackendSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, curricula } = input
      await ctx.db.transaction().execute(async (trx) => {
        const { id: cycleId } = await trx
          .insertInto('Cycle')
          .values({ name })
          .returning('id')
          .executeTakeFirstOrThrow()
        await trx
          .insertInto('CycleCurriculum')
          .values(curricula.map((curriculumId) => ({ curriculumId, cycleId })))
          .execute()
      })
      return true
    }),

  get: protectedProcedure
    .input(getCycleSchema)
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Cycle')
        .selectAll()
        .where('id', '=', input.id)
        .select(applyCyclesInclude(input?.include))
        .executeTakeFirst(),
    ),

  list: protectedProcedure
    .input(listCycleSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyCyclesFilters(input?.filters)

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
        ctx.db
          .selectFrom('Cycle')
          .selectAll()
          .select(applyCyclesInclude(input?.include))
          .where(where),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  update: protectedProcedure
    .input(updateCycleBackendSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, curricula } = input
      await ctx.db.transaction().execute(async (trx) => {
        await trx
          .updateTable('Cycle')
          .set({ name })
          .where('id', '=', id)
          .execute()
        await trx
          .deleteFrom('CycleCurriculum')
          .where('cycleId', '=', id)
          .execute()
        await trx
          .insertInto('CycleCurriculum')
          .values(
            curricula.map((curriculumId) => ({ curriculumId, cycleId: id })),
          )
          .execute()
      })
      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      await deleteCycles(input)
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

      await deleteCycles(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCycles(undefined)
    return true
  }),
})
