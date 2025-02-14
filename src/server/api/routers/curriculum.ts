import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { createCurriculumSchema } from '~/validation/backend/mutations/curriculum/create'
import { getCurriculumSchema } from '~/validation/backend/queries/curriculum/get'
import { listCurriculumSchema } from '~/validation/backend/queries/curriculum/list'
import { updateCurriculumSchema } from '~/validation/backend/mutations/curriculum/update'
import {
  createCurriculum,
  updateCurriculum,
  getEditCurriculum,
  getCurriculaTableList,
  deleteCurricula,
} from '~/services/curriculum'

export const curriculumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCurriculumSchema)
    .mutation(async ({ input }) => {
      await createCurriculum(input)
      return true
    }),

  getEdit: protectedProcedure
    .input(getCurriculumSchema)
    .query(async ({ input }) => {
      const data = await getEditCurriculum(input.id)
      return data
    }),

  list: publicProcedure
    .input(listCurriculumSchema.optional())
    .query(async ({ input }) => {
      const data = await getCurriculaTableList(input)
      return data
    }),

  getTableList: protectedProcedure
    .input(listCurriculumSchema.optional())
    .query(async ({ ctx, input }) => {
      const data = await getCurriculaTableList(input)
      return data
    }),

  update: protectedProcedure
    .input(updateCurriculumSchema)
    .mutation(async ({ input }) => {
      await updateCurriculum(input)
      return true
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      await deleteCurricula(input)
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteCurricula(input)
      return true
    }),
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCurricula(undefined)
    return true
  }),
})
