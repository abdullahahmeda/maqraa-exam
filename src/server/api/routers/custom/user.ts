import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { editUserSchema } from '~/validation/editUserSchema'
import { TRPCError } from '@trpc/server'
import { newUserSchema } from '~/validation/newUserSchema'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { GaxiosError } from 'gaxios'
import { studentSchema } from '~/validation/studentSchema'
import { sendMail, sendPasswordChangedEmail } from '~/utils/email'
import { getBaseUrl } from '~/utils/api'
import { updateProfileSchema } from '~/validation/updateProfileSchema'
import { compareSync, hashSync } from 'bcryptjs'
import { forgotPasswordSchema } from '~/validation/forgotPasswordSchema'
import { add } from 'date-fns'
import { resetPasswordSchema } from '~/validation/resetPasswordSchema'
import { UserRole } from '~/kysely/enums'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { ExpressionBuilder, SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import bcrypt from 'bcryptjs'
import { importFromGoogleSheet } from '~/services/sheet'
import { Client } from '@upstash/qstash'
import { env } from '~/env.mjs'
import { sleep } from '~/utils/sleep'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

const userFiltersSchema = z.object({
  email: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  cycleId: z.string().optional(),
})

function restrictUsersRows<O>(
  query: SelectQueryBuilder<DB, 'User', O>,
  user: { id: string; role: UserRole } | undefined
) {
  if (!user) return query.limit(0) // not signed in
  if (user.role !== 'ADMIN') return query.where('User.id', '=', user.id) // non admins
  return query // admins
}

const userIncludeSchema = z.object({
  cycles: z.boolean().optional(),
})

function withCycles(eb: ExpressionBuilder<DB, 'User'>) {
  return jsonArrayFrom(
    eb
      .selectFrom('UserCycle')
      .leftJoin('Cycle', 'UserCycle.cycleId', 'Cycle.id')
      .leftJoin('Curriculum', 'UserCycle.curriculumId', 'Curriculum.id')
      .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
      .leftJoin('Course', 'Track.courseId', 'Course.id')
      .selectAll('UserCycle')
      .select([
        'Course.id as courseId',
        'Track.id as trackId',
        'Cycle.name as cycleName',
      ])
      .whereRef('UserCycle.userId', '=', 'User.id')
  ).as('cycles')
}

function applyInclude<O>(
  query: SelectQueryBuilder<DB, 'User', O>,
  includes: z.infer<typeof userIncludeSchema> | undefined
) {
  return query.$if(!!includes?.cycles, (qb) => qb.select(withCycles))
}

function applyUserFilters<O>(
  query: SelectQueryBuilder<DB, 'User', O>,
  filters: z.infer<typeof userFiltersSchema>
) {
  return applyFilters(query, filters, {
    email: (query, email) =>
      query.where('email', 'like', `${email as string}%`),
    cycleId: (query, cycleId) =>
      query.where(({ selectFrom, exists }) =>
        exists(
          selectFrom('UserCycle')
            .whereRef('UserCycle.userId', '=', 'User.id')
            .where('UserCycle.cycleId', '=', cycleId as string)
        )
      ),
  })
}

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string(), include: userIncludeSchema.optional() }))
    .query(async ({ ctx, input }) => {
      const user = applyInclude(
        ctx.db
          .selectFrom('User')
          .select([
            'User.id',
            'User.email',
            'User.name',
            'User.phone',
            'User.role',
          ])
          .where('User.id', '=', input.id),
        input.include
      )
      return user.executeTakeFirst()
    }),

  list: protectedProcedure
    .input(
      z.object({
        filters: userFiltersSchema,
        pagination: paginationSchema.optional(),
        include: userIncludeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = restrictUsersRows(
        applyInclude(
          applyPagination(
            applyUserFilters(
              ctx.db.selectFrom('User').select(['id', 'email', 'name', 'role']),
              input.filters
            ),
            input.pagination
          ),
          input.include
        ),
        ctx.session?.user
      )
      return await query.execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: userFiltersSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = restrictUsersRows(
        applyUserFilters(
          ctx.db
            .selectFrom('User')
            .select(({ fn }) => fn.count('id').as('total')),
          input.filters
        ),
        ctx.session?.user
      )
      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),
  create: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
        })

      const { email, password, name, role, phone } = input
      const hashedPassword = bcrypt.hashSync(password, 12)
      await ctx.db.transaction().execute(async (trx) => {
        const user = await trx
          .insertInto('User')
          .values({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
        if (role === 'CORRECTOR') {
          await trx
            .insertInto('UserCycle')
            .values(
              Object.entries(input.corrector.cycles).flatMap(
                ([cycleId, { curricula }]) =>
                  curricula.map((curriculumId) => ({
                    cycleId,
                    curriculumId,
                    userId: user.id,
                  }))
              )
            )
            .returning('id')
            .executeTakeFirstOrThrow()
        } else if (role === 'STUDENT') {
          await trx
            .insertInto('UserCycle')
            .values(
              Object.entries(input.student.cycles).map(
                ([cycleId, { curriculumId }]) => ({
                  cycleId,
                  curriculumId,
                  userId: user.id,
                })
              )
            )
            .execute()
        }
      })

      await sendMail({
        subject: 'تم إضافة حسابك في المقرأة!',
        to: [{ email }],
        textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}`,
      })

      return true
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
      const spreadsheetId = getSpreadsheetIdFromURL(url) as string

      let data: {
        email: string
        name: string
        phone: string
        courseName: string
        trackName: string
        curriculumName: string
      }[]
      try {
        data = await importFromGoogleSheet({
          spreadsheetId,
          sheetName,
          mapper: (row) => ({
            name: row[0],
            phone: row[1],
            courseName: row[2],
            trackName: row[3],
            curriculumName: row[4],
            email: row[5],
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

      const qstashClient = new Client({ token: env.QSTASH_TOKEN })

      for (const [i, student] of data.entries()) {
        if (i > 0 && i % 100 === 0) await sleep(1100) // Do not hit 100 message per second limit
        await qstashClient.publishJSON({
          url: `${getBaseUrl()}/api/createUserFromSheet`,
          body: { ...student, cycleId },
        })
      }
    }),

  update: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId, email, name, role, password, phone } = input
      await ctx.db.transaction().execute(async (trx) => {
        await trx
          .updateTable('User')
          .set({
            name,
            email,
            phone,
            role,
          })
          .$if(!!password, (qb) => {
            const hashedPassword = bcrypt.hashSync(password as string)
            return qb.set({ password: hashedPassword })
          })
          .where('id', '=', userId)
          .execute()
        if (role === 'CORRECTOR') {
          const recordsToKeep = Object.values(input.corrector.cycles)
            .filter((c) => typeof c.id !== 'undefined')
            .map((c) => c.id as string)
          await trx
            .deleteFrom('UserCycle')
            .where('userId', '=', userId)
            .where('id', 'not in', recordsToKeep)
            .execute()
          for (const [cycleId, { id, curricula }] of Object.entries(
            input.corrector.cycles
          )) {
            // TODO: here
          }
          // await trx
          //   .insertInto('UserCycle')
          //   .values(
          //     Object.entries(input.corrector.cycles).flatMap(
          //       ([cycleId, { curricula }]) =>
          //         curricula.map((curriculumId) => ({
          //           cycleId,
          //           curriculumId,
          //           userId,
          //         }))
          //     )
          //   )
          //   .returning('id')
          //   .executeTakeFirstOrThrow()
        } else if (role === 'STUDENT') {
          const recordsToKeep = Object.values(input.student.cycles)
            .filter((c) => typeof c.id !== 'undefined')
            .map((c) => c.id as string)
          await trx
            .deleteFrom('UserCycle')
            .where('userId', '=', userId)
            .where('id', 'not in', recordsToKeep)
            .execute()
          for (const [cycleId, { id, curriculumId }] of Object.entries(
            input.student.cycles
          )) {
            if (id)
              await trx
                .updateTable('UserCycle')
                .set({ curriculumId })
                .where('id', '=', id)
                .execute()
            else
              await trx
                .insertInto('UserCycle')
                .values({ userId, curriculumId, cycleId })
                .execute()
          }
        }
      })

      // if password changed
      if (password) {
        try {
          await sendPasswordChangedEmail({ email, password })
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'تم تعديل البيانات لكن حدث خطأ أثناء إرسال الإيميل',
          })
        }
      }

      return true
      //   return response
      // } catch (error) {
      //   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //     if (error.code === 'P2002')
      //       throw new TRPCError({
      //         code: 'BAD_REQUEST',
      //         message: 'هذا البريد الإلكتروني مسجل بالفعل',
      //       })
      //   }

      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: 'حدث خطأ غير متوقع',
      //   })
      // }
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      let password: string | undefined = undefined
      if (input.changePassword) {
        const user = await ctx.db
          .selectFrom('User')
          .selectAll()
          .where('id', '=', ctx.session.user.id)
          .executeTakeFirstOrThrow()

        const isPasswordCorrect = compareSync(
          input.currentPassword,
          user.password
        )

        if (!isPasswordCorrect)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'حقل كلمة المرور الحالية غير صحيح',
            cause: new z.ZodError([
              {
                code: 'custom',
                message: 'كلمة المرور هذه غير صحيحة',
                path: ['currentPassword'],
              },
            ]),
          })
        password = input.newPassword
      }

      return await ctx.db
        .updateTable('User')
        .set({
          name: input.name,
          phone: input.phone,
          ...(password ? { password: hashSync(password, 12) } : {}),
        })
        .returning(['name', 'phone'])
        .executeTakeFirst()
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .selectFrom('User')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirst()
      if (!user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الحساب غير موجود',
        })
      const expires = add(new Date(), { hours: 24 })
      const { token } = await ctx.db
        .insertInto('ResetPasswordToken')
        .values({ expires, userId: user.id })
        .returning('token')
        .executeTakeFirstOrThrow()

      await sendMail({
        subject: 'طلب تغيير كلمة المرور',
        to: [{ email: input.email }],
        textContent: `قم بتغيير كلمة المرور الخاصة بك من خلال الرابط: ${
          getBaseUrl() + '/reset-password/' + token
        }`,
      })
      return true
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, password } = input
      const passwordToken = await ctx.db
        .selectFrom('ResetPasswordToken')
        .selectAll()
        .where('token', '=', token)
        .where('expires', '>', new Date())
        .executeTakeFirst()

      if (!passwordToken)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا التوكين غير موجود',
        })

      await ctx.db.transaction().execute(async (trx) => {
        await trx
          .updateTable('User')
          .set({ password: hashSync(password, 12) })
          .where('id', '=', passwordToken.userId)
          .execute()
        await trx
          .deleteFrom('ResetPasswordToken')
          .where('token', '=', token)
          .execute()
      })

      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('User').where('id', '=', input).execute()
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('User').where('id', 'in', input).execute()
      return true
    }),
})
