import { createTRPCRouter, protectedProcedure } from '../trpc'
import { checkRead, checkMutate, db } from './schemas/helper'
import { CourseSchema } from './schemas/Course.schema'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { z } from 'zod'

// export const coursesRouter = createTRPCRouter({
//   list: adminOnlyProcedure
//     .input(
//       z.object({
//         page: z.number().positive().int().optional()
//       })
//     )
//     .query(async ({ input }) => {
//       const pageSize = 50
//       const page = input.page || 1

//       return await getPaginatedCourses({ page, pageSize })
//     }),
//   fetchAll: protectedProcedure.query(async () => {
//     return await fetchAllCourses()
//   }),
//   create: adminOnlyProcedure
//     .input(newCourseSchema)
//     .mutation(async ({ input }) => {
//       let course
//       try {
//         course = await createCourse(input)
//       } catch (error) {
//
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع'
//         })
//       }
//       return course
//     }),
//   delete: adminOnlyProcedure
//     .input(
//       z.object({
//         id: z.number().positive().int()
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         await deleteCourse(input.id)
//       } catch (error) {
//
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع'
//         })
//       }
//       return true
//     })
// })

export const coursesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCourseSchema)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.create({ data: input }))
    ),

  count: protectedProcedure
    .input(CourseSchema.count)
    .query(async ({ ctx, input }) => checkMutate(db(ctx).course.count(input))),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(CourseSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).course.findFirst(input))),

  findMany: protectedProcedure
    .input(CourseSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).course.findMany(input))),

  update: protectedProcedure
    .input(CourseSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).course.update(input))
    ),
})
