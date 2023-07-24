import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { checkMutate, db, checkRead } from './helper'
import { CycleWhereInputObjectSchema } from '.zenstack/zod/objects'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { editCycleSchema } from '~/validation/editCycleSchema'
import { CycleInputSchema } from '@zenstackhq/runtime/zod/input'

export const cyclesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCycleSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.create({ data: input }))
    ),

  count: protectedProcedure
    .input(z.object({ where: CycleWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) =>
      checkRead(db(ctx).cycle.count(input as any))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(CycleInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirst(input))),

  findFirstOrThrow: protectedProcedure
    .input(CycleInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).cycle.findFirstOrThrow(input))
    ),

  findMany: protectedProcedure
    .input(CycleInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).cycle.findMany(input))),

  update: protectedProcedure
    .input(editCycleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return checkMutate(db(ctx).cycle.update({ where: { id }, data }))
    }),
})
