import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { checkMutate, checkRead, db } from './helper'
import { TrackSchema } from './schemas/Track.schema'
import { TrackWhereInputObjectSchema } from './schemas/objects'
import { newTrackSchema } from '~/validation/newTrackSchema'

export const tracksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newTrackSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.create({ data: input }))
    ),

  count: protectedProcedure
    .input(z.object({ where: TrackWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) => checkRead(db(ctx).track.count(input))),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(TrackSchema.findFirst)
    .query(({ ctx, input }) => checkRead(db(ctx).track.findFirst(input))),

  findMany: protectedProcedure
    .input(TrackSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).track.findMany(input))),

  update: protectedProcedure
    .input(TrackSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.update(input))
    ),
})
