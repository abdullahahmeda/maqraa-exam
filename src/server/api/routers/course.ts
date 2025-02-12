import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createCourseSchema } from '~/validation/backend/mutations/course/create'
import { getCourseSchema } from '~/validation/backend/queries/course/get'
import { listCourseSchema } from '~/validation/backend/queries/course/list'
import { updateCourseSchema } from '~/validation/backend/mutations/course/update'
import {
  createCourse,
  getCoursesTableList,
  getEditCourse,
  updateCourse,
  deleteCourses,
} from '~/services/course'

export const courseRouter = createTRPCRouter({
  create: adminProcedure
    .input(createCourseSchema)
    .mutation(async ({ input }) => {
      await createCourse(input)
      return true
    }),

  getEdit: adminProcedure.input(getCourseSchema).query(async ({ input }) => {
    const course = await getEditCourse(input.id)
    return course
  }),

  // TODO: rename this
  list: publicProcedure
    .input(listCourseSchema.optional())
    .query(async ({ input }) => {
      const data = getCoursesTableList(input)
      return data
    }),

  getTableList: protectedProcedure
    .input(listCourseSchema.optional())
    .query(async ({ input }) => {
      const data = getCoursesTableList(input)
      return data
    }),

  update: adminProcedure
    .input(updateCourseSchema)
    .mutation(async ({ ctx, input }) => {
      await updateCourse(input)
      return true
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })

    await deleteCourses(input)
    return true
  }),

  bulkDelete: adminProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteCourses(input)
      return true
    }),

  deleteAll: adminProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCourses(undefined)
    return true
  }),
})
