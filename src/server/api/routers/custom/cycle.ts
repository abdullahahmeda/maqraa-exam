import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { checkMutate, db, checkRead } from './helper'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { editCycleSchema } from '~/validation/editCycleSchema'

export const cycleRouter = createTRPCRouter({
  createCycle: protectedProcedure
    .input(newCycleSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.create({ data: input }))
    ),
 
  updateCycle: protectedProcedure
    .input(editCycleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return checkMutate(db(ctx).cycle.update({ where: { id }, data }))
    }),
})
