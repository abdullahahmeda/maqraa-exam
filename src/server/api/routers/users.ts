// import { TRPCError } from '@trpc/server'
// import { logErrorToLogtail } from '~/utils/logtail'
// import { adminOnlyProcedure, createTRPCRouter, publicProcedure } from '../trpc'
// import { registerSchema } from '~/validation/registerSchema'
// import {
//   createUser,
//   getPaginatedUsers,
//   getUser,
//   registerStudent,
//   updateUser,
// } from '~/services/users'
// import { z } from 'zod'
// import { updateUserSchema } from '~/validation/updateUserSchema'
// import { newUserSchema } from '~/validation/newUserSchema'

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { UserSchema } from './schemas/User.schema'
import { checkMutate, db, checkRead } from './schemas/helper'

// export const usersRouter = createTRPCRouter({
//   list: adminOnlyProcedure
//     .input(
//       z.object({
//         page: z.number().positive().int().optional(),
//       })
//     )
//     .query(async ({ input }) => {
//       const pageSize = 50
//       const page = input.page || 1

//       return await getPaginatedUsers({ page, pageSize })
//     }),
//   get: adminOnlyProcedure
//     .input(
//       z.object({
//         id: z.string().min(1),
//       })
//     )
//     .query(async ({ input }) => {
//       return await getUser(input.id)
//     }),
//   update: adminOnlyProcedure
//     .input(updateUserSchema)
//     .mutation(async ({ input }) => {
//       try {
//         await updateUser(input)
//       } catch (error: any) {
//         if (error.code === 'P2002')
//           throw new TRPCError({
//             code: 'BAD_REQUEST',
//             message: 'هذا البريد الإلكتروني مستخدم بالفعل',
//           })

//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
//   create: adminOnlyProcedure
//     .input(newUserSchema)
//     .mutation(async ({ input }) => {
//       try {
//         await createUser(input)
//       } catch (error: any) {
//         if (error.code === 'P2002')
//           throw new TRPCError({
//             code: 'BAD_REQUEST',
//             message: 'هذا البريد الإلكتروني مسجل بالفعل',
//           })

//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
//   createStudent: publicProcedure
//     .input(registerSchema)
//     .mutation(async ({ input }) => {
//       try {
//         await registerStudent(input)
//       } catch (error: any) {
//         if (error.code === 'P2002')
//           throw new TRPCError({
//             code: 'BAD_REQUEST',
//             message: 'هذا البريد الإلكتروني مسجل بالفعل',
//           })

//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
//   // update: adminOnlyProcedure.input()
// })

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(UserSchema.create)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).user.create(input))
    ),

  delete: protectedProcedure
    .input(UserSchema.delete)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).user.delete(input))
    ),

  findFirst: protectedProcedure
    .input(UserSchema.findFirst)
    .query(({ ctx, input }) => checkRead(db(ctx).user.findFirst(input))),

  findMany: protectedProcedure
    .input(UserSchema.findMany)
    .query(({ ctx, input }) => checkRead(db(ctx).user.findMany(input))),

  update: protectedProcedure
    .input(UserSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).user.update(input))
    ),
})
