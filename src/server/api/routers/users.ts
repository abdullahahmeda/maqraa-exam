import { TRPCError } from '@trpc/server'
import { logErrorToLogtail } from '~/utils/logtail'
import { adminOnlyProcedure, createTRPCRouter, publicProcedure } from '../trpc'
import { registerSchema } from '~/validation/registerSchema'
import {
  getPaginatedUsers,
  getUser,
  registerStudent,
  updateUser
} from '~/services/users'
import { z } from 'zod'
import { updateUserSchema } from '~/validation/updateUserSchema'

export const usersRouter = createTRPCRouter({
  list: adminOnlyProcedure
    .input(
      z.object({
        page: z.number().positive().int().optional()
      })
    )
    .query(async ({ input }) => {
      const pageSize = 50
      const page = input.page || 1

      return await getPaginatedUsers({ page, pageSize })
    }),
  get: adminOnlyProcedure
    .input(
      z.object({
        id: z.string().min(1)
      })
    )
    .query(async ({ input }) => {
      return await getUser(input.id)
    }),
  update: adminOnlyProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      try {
        await updateUser(input)
      } catch (error: any) {
        if (error.code === 'P2002')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'هذا البريد الإلكتروني مستخدم بالفعل'
          })

        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    }),
  createStudent: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        await registerStudent(input)
      } catch (error: any) {
        if (error.code === 'P2002')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'هذا البريد الإلكتروني مسجل بالفعل'
          })

        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    })
  // update: adminOnlyProcedure.input()
})
