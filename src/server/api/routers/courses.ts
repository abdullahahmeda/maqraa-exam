import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  createCourse,
  deleteCourse,
  fetchAllCourses,
  getPaginatedCourses
} from '~/services/courses'
import { logErrorToLogtail } from '~/utils/logtail'
import { newCourseSchema } from '~/validation/newCourseSchema'
import {
  adminOnlyProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '../trpc'

export const coursesRouter = createTRPCRouter({
  list: adminOnlyProcedure
    .input(
      z.object({
        page: z.number().positive().int().optional()
      })
    )
    .query(async ({ input }) => {
      const pageSize = 50
      const page = input.page || 1

      return await getPaginatedCourses({ page, pageSize })
    }),
  fetchAll: protectedProcedure.query(async () => {
    return await fetchAllCourses()
  }),
  create: adminOnlyProcedure
    .input(newCourseSchema)
    .mutation(async ({ input }) => {
      let course
      try {
        course = await createCourse(input)
      } catch (error) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return course
    }),
  delete: adminOnlyProcedure
    .input(
      z.object({
        id: z.number().positive().int()
      })
    )
    .mutation(async ({ input }) => {
      try {
        await deleteCourse(input.id)
      } catch (error) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    })
})
