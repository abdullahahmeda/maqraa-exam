import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'

import { createCycleBackendSchema } from '~/validation/backend/mutations/cycle/create'
import { updateCycleBackendSchema } from '~/validation/backend/mutations/cycle/update'
import { listCycleSchema } from '~/validation/backend/queries/cycle/list'
import {
  deleteCycles,
  createCycle,
  getCycle,
  getCycleForEdit,
  getCyclesForTable,
  getCycles,
  updateCycle
} from '~/services/cycle'

export const cycleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCycleBackendSchema)
    .mutation(async ({ ctx, input }) => {
      await createCycle(input)
      return true
    }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return getCycle(input.id)
  }),
  
  getOneForEdit: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return getCycleForEdit(input.id)
  }),

  getList: protectedProcedure
    .input(listCycleSchema.optional())
    .query(async ({ ctx, input }) => {
      return getCycles(input)
    }),

    getListForTable: protectedProcedure
    .input(listCycleSchema.optional())
    .query(async ({ ctx, input }) => {
      return getCyclesForTable(input)
    }),

  update: protectedProcedure
    .input(updateCycleBackendSchema)
    .mutation(async ({ ctx, input }) => {
      await updateCycle(input)
      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
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
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteCycles(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCycles(undefined)
    return true
  }),
})
