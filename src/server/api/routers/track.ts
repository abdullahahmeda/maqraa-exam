import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import { TRPCError } from '@trpc/server'
import { listTrackSchema } from '~/validation/backend/queries/track/list'
import { getTrackSchema } from '~/validation/backend/queries/track/get'
import { createTrackSchema } from '~/validation/backend/mutations/track/create'
import { updateTrackSchema } from '~/validation/backend/mutations/track/update'
import {
  createTrack,
  updateTrack,
  getEditTrack,
  getTracksTableList,
  deleteTracks,
} from '~/services/track'

export const trackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTrackSchema)
    .mutation(async ({ ctx, input }) => {
      await createTrack(input)
      return true
    }),

  update: protectedProcedure
    .input(updateTrackSchema)
    .mutation(async ({ input }) => {
      await updateTrack(input)
      return true
    }),

  getTableList: protectedProcedure
    .input(listTrackSchema.optional())
    .query(async ({ input }) => {
      const data = await getTracksTableList(input)
      return data
    }),

  list: publicProcedure
    .input(listTrackSchema.optional())
    .query(async ({ input }) => {
      const data = await getTracksTableList(input)
      return data
    }),

  getEdit: protectedProcedure.input(getTrackSchema).query(async ({ input }) => {
    const data = await getEditTrack(input.id)
    return data
  }),
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
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      await deleteTracks(input)
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

      await deleteTracks(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteTracks(undefined)
    return true
  }),
})
