// import { TRPCError } from '@trpc/server'
// import { z } from 'zod'
// import {
//   createCurriculum,
//   deleteCurriculum,
//   fetchAllCurricula,
//   getPaginatedCurricula,
// } from '~/services/curricula'
// import { logErrorToLogtail } from '~/utils/logtail'
// import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
// import {
//   adminOnlyProcedure,
//   createTRPCRouter,
//   protectedProcedure,
//   publicProcedure,
// } from '../trpc'

import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { CurriculumInputSchema } from '@zenstackhq/runtime/zod/input'
import { checkMutate, checkRead, db } from './helper'
import { CurriculumWhereInputObjectSchema } from '.zenstack/zod/objects'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'

export const curriculaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { parts, ...data } = input
      return checkMutate(
        db(ctx).curriculum.create({
          data: {
            ...data,
            parts: { create: parts },
          },
        })
      )
    }),

  count: protectedProcedure
    .input(z.object({ where: CurriculumWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) =>
      checkRead(db(ctx).curriculum.count(input as any))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).curriculum.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(CurriculumInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirst(input))),

  findFirstOrThrow: protectedProcedure
    .input(CurriculumInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).curriculum.findFirstOrThrow(input))
    ),

  findMany: publicProcedure
    .input(CurriculumInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findMany(input))),

  update: protectedProcedure
    .input(editCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, parts, ...data } = input
      return checkMutate(
        db(ctx).curriculum.update({
          where: { id },
          data: {
            ...data,
            parts: { deleteMany: {}, create: parts },
          },
        })
      )
    }),
})
