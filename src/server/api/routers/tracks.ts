import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { checkMutate, checkRead, db } from './helper'
import { TrackInputSchema } from '@zenstackhq/runtime/zod/input'
import { TrackWhereInputObjectSchema } from '.zenstack/zod/objects'
import { newTrackSchema } from '~/validation/newTrackSchema'

export const tracksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newTrackSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.create({ data: input }))
    ),

  count: protectedProcedure
    .input(z.object({ where: TrackWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) =>
      checkRead(db(ctx).track.count(input as any))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(TrackInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).track.findFirst(input))),

  findFirstOrThrow: protectedProcedure
    .input(TrackInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).track.findFirstOrThrow(input))
    ),

  findMany: publicProcedure
    .input(TrackInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).track.findMany(input))),

  update: protectedProcedure
    .input(TrackInputSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.update(input))
    ),
})
