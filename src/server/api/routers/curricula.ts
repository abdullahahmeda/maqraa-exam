import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  createCurriculum,
  deleteCurriculum,
  fetchAllCurricula,
  getPaginatedCurricula
} from '~/services/curricula'
import { logErrorToLogtail } from '~/utils/logtail'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import {
  adminOnlyProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '../trpc'

const filtersSchema = z
  .object({
    course: z.number().positive().int().optional()
  })
  .optional()

export type FilterSchema = z.infer<typeof filtersSchema>

export const curriculaRouter = createTRPCRouter({
  list: adminOnlyProcedure
    .input(
      z.object({
        page: z.number().positive().int().optional()
      })
    )
    .query(async ({ input }) => {
      const pageSize = 50
      const page = input.page || 1

      return await getPaginatedCurricula({ page, pageSize })
    }),
  fetchAll: protectedProcedure
    .input(
      z
        .object({
          filters: filtersSchema
        })
        .optional()
    )
    .query(async ({ input }) => {
      input = {
        filters: {
          course: undefined,
          ...input?.filters
        }
      }
      return await fetchAllCurricula({ filters: input.filters })
    }),
  create: adminOnlyProcedure
    .input(newCurriculumSchema)
    .mutation(async ({ input }) => {
      let course
      try {
        course = await createCurriculum(input)
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
        await deleteCurriculum(input.id)
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
