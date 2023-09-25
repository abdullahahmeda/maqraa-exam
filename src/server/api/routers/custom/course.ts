import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { checkMutate, db } from './helper'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { editCourseSchema } from '~/validation/editCourseSchema'

export const courseRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(newCourseSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.create({ data: input }))
    ),

  updateCourse: protectedProcedure
    .input(editCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return checkMutate(db(ctx).course.update({ where: { id }, data }))
    }),
})
