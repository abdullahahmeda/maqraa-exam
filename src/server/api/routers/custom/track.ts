import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc'
import { checkMutate, checkRead, db } from './helper'
import { newTrackSchema } from '~/validation/newTrackSchema'

export const trackRouter = createTRPCRouter({
  createTrack: protectedProcedure
    .input(newTrackSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).track.create({ data: input }))
    ),

  // updateTrack: protectedProcedure
  //   .input(TrackInputSchema.update)
  //   .mutation(async ({ ctx, input }) =>
  //     checkMutate(db(ctx).track.update(input))
  //   ),
})
