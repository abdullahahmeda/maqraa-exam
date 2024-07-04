import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { getSpreadsheetIdFromURL } from '~/utils/strings'
import { GaxiosError } from 'gaxios'
import { studentSchema } from '~/validation/studentSchema'
import { sendMail, sendPasswordChangedEmail } from '~/utils/email'
import { updateProfileSchema } from '~/validation/updateProfileSchema'
import { compareSync, hashSync } from 'bcryptjs'
import { forgotPasswordSchema } from '~/validation/forgotPasswordSchema'
import { add } from 'date-fns'
import { resetPasswordSchema } from '~/validation/resetPasswordSchema'
import { importFromGoogleSheet } from '~/services/sheet'
import { Client } from '@upstash/qstash'
import { env } from '~/env.js'
import { sleep } from '~/utils/sleep'
// import { hashPassword } from '~/utils/server/password'
import { getUserSchema } from '~/validation/backend/queries/user/get'
import { listUserSchema } from '~/validation/backend/queries/user/list'
import { createUserSchema } from '~/validation/backend/mutations/user/create'
import { updateUserSchema } from '~/validation/backend/mutations/user/update'
import { getBaseUrl } from '~/utils/getBaseUrl'
import { applyPagination } from '~/utils/db'
import {
  applyUsersFilters,
  applyUsersInclude,
  deleteUsers,
} from '~/services/user'

export const userRouter = createTRPCRouter({
  get: protectedProcedure.input(getUserSchema).query(async ({ ctx, input }) => {
    return ctx.db
      .selectFrom('User')
      .select([
        'id',
        'name',
        'email',
        'emailVerified',
        'image',
        'phone',
        'role',
      ])
      .where('User.id', '=', input.id)
      .select(applyUsersInclude(input.include))
      .executeTakeFirst()
  }),

  list: protectedProcedure
    .input(listUserSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyUsersFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('User')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('User')
          .selectAll()
          .where(where)
          .select(applyUsersInclude(input?.include)),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),
  // count: protectedProcedure
  //   .input(z.object({ filters: filtersSchema.optional() }).optional())
  //   .query(async ({ ctx, input }) => {
  //     const userService = new UserService(ctx.db)
  //     const count = await userService.getCount(input?.filters)
  //     return count
  //   }),
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
        })

      // const userService = new UserService(ctx.db)
      // await userService.create(input)

      const { email, password, name, role, phone } = input
      // const hashedPassword = hashPassword(password!)
      // await ctx.db.transaction().execute(async (trx) => {
      //   const user = await trx
      //     .insertInto('User')
      //     .values({
      //       name,
      //       email,
      //       password: hashedPassword,
      //       role,
      //       phone,
      //     })
      //     .returning('id')
      //     .executeTakeFirstOrThrow()
      //
      //   if (role === 'CORRECTOR') {
      //     await trx
      //       .insertInto('UserCycle')
      //       .values(
      //         Object.entries(input.corrector.curricula).flatMap(
      //           ([cycleId, curricula]) =>
      //             curricula.map(({ value: curriculumId }) => ({
      //               cycleId,
      //               curriculumId,
      //               userId: user.id,
      //             })),
      //         ),
      //       )
      //       .returning('id')
      //       .executeTakeFirstOrThrow()
      //   } else if (role === 'STUDENT') {
      //     await trx
      //       .insertInto('UserCycle')
      //       .values(
      //         Object.entries(input.student.curricula).map(
      //           ([cycleId, { curriculumId }]) => ({
      //             cycleId,
      //             curriculumId,
      //             userId: user.id,
      //           }),
      //         ),
      //       )
      //       .execute()
      //   }
      //   return user
      // })
      //
      // await sendMail({
      //   subject: 'تم إضافة حسابك في المقرأة!',
      //   to: [{ email }],
      //   textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}`,
      // })
      //
      // return true
    }),

  import: protectedProcedure
    .input(importUsersSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
        })

      const { url, sheetName, cycleId } = input
      const spreadsheetId = getSpreadsheetIdFromURL(url)!

      let data: {
        email: string
        name: string
        phone: string
        courseName: string
        trackName: string
        curriculumName: string
      }[]
      try {
        // const rows = await getRowsFromSheet(spreadsheetId, sheetName)
        data = await importFromGoogleSheet({
          spreadsheetId,
          sheetName,
          mapper: (row) => ({
            name: row[0] as string,
            phone: row[1] as string,
            courseName: row[2] as string,
            trackName: row[3] as string,
            curriculumName: row[4] as string,
            email: row[5] as string,
          }),
          validationSchema: studentSchema,
        })
      } catch (error) {
        if (error instanceof GaxiosError) {
          if (Number(error.code) === 404) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'هذا الملف غير موجود',
            })
          }
          if (Number(error.code) === 403 || Number(error.code) === 400) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'الصلاحيات غير كافية، تأكد من تفعيل مشاركة الملف',
            })
          }
        }

        if (error instanceof ZodError) {
          const issue = error.issues[0]!

          const [rowNumber, field] = issue.path

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
            cause: issue,
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع',
        })
      }

      const apiUrl = `${getBaseUrl()}/api/createUserFromSheet`
      if (env.NODE_ENV === 'development') {
        for (const student of data) {
          await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ ...student, cycleId }),
          })
        }
      } else {
        const qstashClient = new Client({ token: env.QSTASH_TOKEN })

        for (const [i, student] of data.entries()) {
          if (i > 0 && i % 100 === 0) await sleep(1100) // Do not hit 100 message per second limit
          await qstashClient.publishJSON({
            url: apiUrl,
            body: { ...student, cycleId },
          })
        }
      }
    }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const { id: userId, email, name, role, password, phone } = input
      // await ctx.db.transaction().execute(async (trx) => {
      //   await trx
      //     .updateTable('User')
      //     .set({
      //       name,
      //       email,
      //       phone,
      //       role,
      //     })
      //     .$if(!!password, (qb) => {
      //       const hashedPassword = hashPassword(password!)
      //       return qb.set({ password: hashedPassword })
      //     })
      //     .where('id', '=', userId)
      //     .execute()
      //   if (role === 'CORRECTOR') {
      //     const recordsToKeep: { cycleId: string; curriculumId: string }[] = []
      //     for (const { value: cycleId } of input.corrector.cycles) {
      //       const curricula = Object.values(input.corrector.curricula[cycleId]!)
      //       for (const { value: curriculumId } of curricula) {
      //         recordsToKeep.push({ cycleId, curriculumId })
      //       }
      //     }
      //     await trx
      //       .deleteFrom('UserCycle')
      //       .where(({ and, eb, or, not }) =>
      //         and([
      //           eb('UserCycle.userId', '=', userId),
      //           // delete where not in "records to keep"
      //           not(
      //             or(
      //               recordsToKeep.map((r) =>
      //                 and([
      //                   eb('UserCycle.curriculumId', '=', r.curriculumId),
      //                   eb('UserCycle.cycleId', '=', r.cycleId),
      //                 ]),
      //               ),
      //             ),
      //           ),
      //         ]),
      //       )
      //       .execute()
      //     await trx
      //       .insertInto('UserCycle')
      //       .values(recordsToKeep.map((r) => ({ ...r, userId })))
      //       .onConflict((oc) =>
      //         oc.columns(['cycleId', 'userId', 'curriculumId']).doNothing(),
      //       )
      //       .execute()
      //   } else if (role === 'STUDENT') {
      //     const recordsToKeep: { cycleId: string; curriculumId: string }[] = []
      //     for (const { value: cycleId } of input.student.cycles) {
      //       const curriculumId = input.student.curricula[cycleId]!.curriculumId
      //       recordsToKeep.push({ cycleId, curriculumId })
      //     }
      //     await trx
      //       .deleteFrom('UserCycle')
      //       .where(({ and, eb, or, not }) =>
      //         and([
      //           eb('UserCycle.userId', '=', userId),
      //           // delete where not in "records to keep"
      //           not(
      //             or(
      //               recordsToKeep.map((r) =>
      //                 and([
      //                   eb('UserCycle.curriculumId', '=', r.curriculumId),
      //                   eb('UserCycle.cycleId', '=', r.cycleId),
      //                 ]),
      //               ),
      //             ),
      //           ),
      //         ]),
      //       )
      //       .execute()
      //     await trx
      //       .insertInto('UserCycle')
      //       .values(recordsToKeep.map((r) => ({ ...r, userId })))
      //       .onConflict((oc) =>
      //         oc.columns(['cycleId', 'userId', 'curriculumId']).doNothing(),
      //       )
      //       .execute()
      //   }
      // })

      // // if password changed
      // if (password) {
      //   try {
      //     await sendPasswordChangedEmail({ email, password })
      //   } catch (error) {
      //     throw new TRPCError({
      //       code: 'INTERNAL_SERVER_ERROR',
      //       message: 'تم تعديل البيانات لكن حدث خطأ أثناء إرسال الإيميل',
      //     })
      //   }
      // }
      //
      // return true
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      let password: string | undefined = undefined
      // if (input.changePassword) {
      //   const user = await ctx.db
      //     .selectFrom('User')
      //     .selectAll()
      //     .where('id', '=', ctx.session.user.id)
      //     .executeTakeFirstOrThrow()
      //
      //   const isPasswordCorrect = compareSync(
      //     input.currentPassword,
      //     user.password,
      //   )
      //
      //   if (!isPasswordCorrect)
      //     throw new TRPCError({
      //       code: 'BAD_REQUEST',
      //       message: 'حقل كلمة المرور الحالية غير صحيح',
      //       cause: new z.ZodError([
      //         {
      //           code: 'custom',
      //           message: 'كلمة المرور هذه غير صحيحة',
      //           path: ['currentPassword'],
      //         },
      //       ]),
      //     })
      //   password = input.newPassword
      // }

      // return await ctx.db
      //   .updateTable('User')
      //   .set({
      //     name: input.name,
      //     phone: input.phone,
      //     ...(password ? { password: hashSync(password, 12) } : {}),
      //   })
      //   .returning(['name', 'phone'])
      //   .where('id', '=', ctx.session.user.id)
      //   .executeTakeFirst()
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // const user = await ctx.db
      //   .selectFrom('User')
      //   .selectAll()
      //   .where('email', '=', input.email)
      //   .executeTakeFirst()
      // if (!user)
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: 'هذا الحساب غير موجود',
      //   })
      // const expires = add(new Date(), { hours: 24 })
      // const { token } = await ctx.db
      //   .insertInto('ResetPasswordToken')
      //   .values({ expires, userId: user.id })
      //   .returning('token')
      //   .executeTakeFirstOrThrow()
      //
      // await sendMail({
      //   subject: 'طلب تغيير كلمة المرور',
      //   to: [{ email: input.email }],
      //   textContent: `قم بتغيير كلمة المرور الخاصة بك من خلال الرابط: ${
      //     getBaseUrl() + '/reset-password/' + token
      //   }`,
      // })
      // return true
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // const { token, password } = input
      // const passwordToken = await ctx.db
      //   .selectFrom('ResetPasswordToken')
      //   .selectAll()
      //   .where('token', '=', token)
      //   .where('expires', '>', new Date())
      //   .executeTakeFirst()
      //
      // if (!passwordToken)
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: 'هذا التوكين غير موجود',
      //   })
      //
      // await ctx.db.transaction().execute(async (trx) => {
      //   await trx
      //     .updateTable('User')
      //     .set({ password: hashPassword(password) })
      //     .where('id', '=', passwordToken.userId)
      //     .execute()
      //   await trx
      //     .deleteFrom('ResetPasswordToken')
      //     .where('token', '=', token)
      //     .execute()
      // })
      //
      // return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // if (ctx.session.user.role !== 'ADMIN')
      //   throw new TRPCError({
      //     code: 'FORBIDDEN',
      //     message: 'لا تملك الصلاحيات لهذه العملية',
      //   })
      //
      // await deleteUsers(input)
      // return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      // if (ctx.session.user.role !== 'ADMIN')
      //   throw new TRPCError({
      //     code: 'FORBIDDEN',
      //     message: 'لا تملك الصلاحيات لهذه العملية',
      //   })
      //
      // await deleteUsers(input)
      // return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    // if (ctx.session.user.role !== 'ADMIN')
    //   throw new TRPCError({
    //     code: 'FORBIDDEN',
    //     message: 'لا تملك الصلاحيات لهذه العملية',
    //   })
    //
    // await deleteUsers(undefined)
    // return true
  }),
})
