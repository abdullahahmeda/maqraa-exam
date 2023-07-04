import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { checkRead, checkMutate, db } from './helper'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { z } from 'zod'
import { CourseInputSchema } from '@zenstackhq/runtime/zod/input'
import { CourseWhereInputObjectSchema } from '.zenstack/zod/objects'
import { editCourseSchema } from '~/validation/editCourseSchema'

export const coursesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCourseSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.create({ data: input }))
    ),

  count: protectedProcedure
    .input(z.object({ where: CourseWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) => checkRead(db(ctx).course.count(input))),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(CourseInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).course.findFirst(input))),

  findFirstOrThrow: protectedProcedure
    .input(CourseInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).course.findFirstOrThrow(input))
    ),

  findMany: publicProcedure
    .input(CourseInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).course.findMany(input))),

  update: protectedProcedure
    .input(editCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return checkMutate(db(ctx).course.update({ where: { id }, data }))
    }),
})
