import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { CycleSchema } from './schemas/Cycle.schema'
import { checkMutate, db, checkRead } from './helper'
import { CycleWhereInputObjectSchema } from './schemas/objects'
import { newCycleSchema } from '~/validation/newCycleSchema'

export const cyclesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCycleSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.create({ data: input }))
    ),

  count: protectedProcedure
    .input(z.object({ where: CycleWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) => checkRead(db(ctx).cycle.count(input))),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(CycleSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirst(input))),

  findMany: protectedProcedure
    .input(CycleSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).cycle.findMany(input))),

  update: protectedProcedure
    .input(CycleSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).cycle.update(input))
    ),
})
