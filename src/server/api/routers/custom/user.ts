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
import { compareSync } from 'bcryptjs'
import { forgotPasswordSchema } from '~/validation/forgotPasswordSchema'
import { add } from 'date-fns'
import { resetPasswordSchema } from '~/validation/resetPasswordSchema'
import { withPassword } from '@zenstackhq/runtime'
import { UserRole } from '~/kysely/enums'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import bcrypt from 'bcryptjs'
import { importFromGoogleSheet } from '~/services/sheet'
import { Client } from '@upstash/qstash'
import { env } from '~/env.mjs'
import { sleep } from '~/utils/sleep'

const userFiltersSchema = z.object({
  email: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
})

function restrictUsersRows<O>(
  query: SelectQueryBuilder<DB, 'User', O>,
  user: { id: string; role: UserRole } | undefined
) {
  if (!user) return query.limit(0) // not signed in
  if (user.role !== 'ADMIN') return query.where('User.id', '=', user.id) // non admins
  return query // admins
}

function applyUserFilters<O>(
  query: SelectQueryBuilder<DB, 'User', O>,
  filters: z.infer<typeof userFiltersSchema>
) {
  return applyFilters(query, filters, {
    email: (query, value) =>
      query.where('email', 'like', `${value as string}%`),
  })
}

const googleSheetErrorHandler = (error: any) => {
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

  throw error
}

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        filters: userFiltersSchema,
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = restrictUsersRows(
        applyPagination(
          applyUserFilters(
            ctx.db.selectFrom('User').select(['id', 'email', 'name', 'role']),
            input.filters
          ),
          input.pagination
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
          const corrector = await trx
            .insertInto('UserCycle')
            .values({
              // TODO: this
              // curriculumId: ,
              userId: user.id,
              cycleId: input.corrector.cycleId,
            })
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

      // const emails = []
      // const coursesNames = []
      // const tracksNames = []
      // const curriculaNames = []

      const qstashClient = new Client({ token: env.QSTASH_TOKEN })

      for (const [i, student] of data.entries()) {
        if (i > 0 && i % 100 === 0) await sleep(1100) // Do not hit 100 message per second limit
        await qstashClient.publishJSON({
          url: `${getBaseUrl()}/api/createUserFromSheet`,
          body: { ...student, cycleId },
        })
      }

      // const students = await ctx.db
      //   .selectFrom('User')
      //   .selectAll()
      //   .where('email', 'in', emails)
      //   .execute()
      // const courses = await ctx.db
      //   .selectFrom('Course')
      //   .selectAll()
      //   .where('name', 'in', coursesNames)
      //   .execute()
      // const tracks = await ctx.db
      //   .selectFrom('Track')
      //   .leftJoin('Course', 'Track.courseId', 'Course.id')
      //   .selectAll('Track')
      //   .select('Course.name as courseName')
      //   .where('name', 'in', tracksNames)
      //   .execute()
      // const curricula = await ctx.db
      //   .selectFrom('Curriculum')
      //   .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
      //   .selectAll('Curriculum')
      //   .select('Track.name as trackName')
      //   .where('name', 'in', emails)
      //   .execute()

      // const exisitngUsers: Record<string, string> = {}
      // const existingCourses: Record<string, string> = {}
      // const existingTracks: Record<string, string> = {}
      // const existingCurricula: Record<string, string> = {}
      // for (
      //   let i = 0;
      //   i <
      //   Math.max(
      //     students.length,
      //     courses.length,
      //     tracks.length,
      //     curricula.length
      //   );
      //   i++
      // ) {
      //   const user = students?.[i]
      //   if (user) exisitngUsers[user.email] = user.id

      //   const course = courses?.[i]
      //   if (course) existingCourses[course.name] = course.id

      //   const track = tracks?.[i]
      //   if (track)
      //     existingTracks[`${track.name}:${track.courseName}`] = track.id

      //   const curriculum = curricula?.[i]
      //   if (curriculum)
      //     existingCurricula[`${curriculum.name}:${curriculum.trackName}`] =
      //       curriculum.id
      // }

      // await ctx.db.transaction().execute(async (trx) => {
      //   for (const student of data) {
      //     let userId = exisitngUsers[student.email]
      //     if (typeof userId === 'undefined')
      //       userId = (await trx
      //         .insertInto('User')
      //         .values({
      //           email: student.email,
      //           name: student.name,
      //           password: bcrypt.hashSync(generatePassword()),
      //           role: 'STUDENT',
      //           phone: student.phone,
      //         })
      //         .returning('id')
      //         .executeTakeFirstOrThrow()).id
      //     await trx
      //       .insertInto('UserCycle')
      //       .values({ cycleId, curriculumId, userId: userId })
      //       .execute()
      //   }
      // })

      // let rows
      // try {
      //   rows = await getFields(spreadsheetId, input.sheet)
      // } catch (error) {
      //   throw googleSheetErrorHandler(error)
      // }

      // for (const [i, row] of rows.entries()) {
      //   if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆

      //   const curriculum = await ctx.db.curriculum.findFirst({
      //     where: {
      //       name: row[4]?.trim(),
      //       track: { course: { name: row[2]?.trim() } },
      //     },
      //   })

      //   if (!curriculum)
      //     throw new TRPCError({
      //       code: 'BAD_REQUEST',
      //       message: `المنهج ${row[4]} غير موجود`,
      //     })

      //   try {
      //     const student = studentSchema.parse(
      //       {
      //         name: row[0],
      //         phone: row[1],
      //         email: row[5],
      //       },
      //       { path: [i + 1] }
      //     )
      //     let s = await ctx.db.student.findFirst({
      //       where: { user: { email: student.email } },
      //     })

      //     const password = generatePassword()

      //     // await sendMail({
      //     //   subject: 'تم إضافة حسابك في المقرأة!',
      //     //   to: [{ email: student.email }],
      //     //   textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}`,
      //     // })
      //     if (!s)
      //       s = await ctx.db.student.create({
      //         data: {
      //           user: {
      //             create: {
      //               ...student,
      //               password,
      //               role: 'STUDENT',
      //             },
      //           },
      //         },
      //       })
      //     !(await ctx.db.studentCycle.create({
      //       data: {
      //         cycle: {
      //           connect: { id: input.cycleId },
      //         },
      //         curriculum: {
      //           connect: { id: curriculum.id },
      //         },
      //         student: {
      //           connect: { id: s.id },
      //         },
      //       },
      //     }))
      //   } catch (error: any) {
      //     if (error instanceof ZodError) {
      //       const issue = error.issues[0]!

      //       const [rowNumber, field] = issue.path

      //       throw new TRPCError({
      //         code: 'BAD_REQUEST',
      //         message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
      //         cause: issue,
      //       })
      //     } else if (
      //       error?.cause instanceof Prisma.PrismaClientKnownRequestError
      //     ) {
      //       console.log(error)
      //       if (error.cause.code === 'P2002')
      //         throw new TRPCError({
      //           code: 'BAD_REQUEST',
      //           message: `خطأ في الصف رقم ${
      //             i + 1
      //           }: هذا الطالب مسجل بالفعل في هذه الدورة`,
      //         })
      //     }

      //     throw new TRPCError({
      //       code: 'INTERNAL_SERVER_ERROR',
      //       message: 'حدث خطأ غير متوقع',
      //     })
      //   }
      // }
    }),

  update: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, email, password, name, role, phone } = input
        const data = Prisma.validator<Prisma.UserUpdateInput>()({
          name,
          email,
          role,
          ...(password ? { password } : {}),
          phone,
          ...(role !== 'STUDENT'
            ? {
                corrector: {
                  upsert: {
                    where: {
                      userId: id,
                    },
                    update: {
                      ...(role === 'CORRECTOR'
                        ? {
                            ...input.corrector,
                            courses: {
                              deleteMany: {},
                              create: input.corrector.courses.map(
                                (courseId) => ({ courseId })
                              ),
                            },
                          }
                        : { cycleId: null, courses: {} }),
                    },
                    create: {
                      ...(role === 'CORRECTOR'
                        ? {
                            ...input.corrector,
                            courses: {
                              deleteMany: {},
                              create: input.corrector.courses.map(
                                (courseId) => ({ courseId })
                              ),
                            },
                          }
                        : { cycleId: null, courses: {} }),
                    },
                  },
                },
              }
            : undefined),
          ...(role === 'STUDENT'
            ? {
                student: {
                  upsert: {
                    where: { userId: id },
                    update: {
                      cycles: {
                        deleteMany: {
                          cycleId: {
                            notIn: Object.keys(input.student.cycles),
                          },
                        },
                        upsert: Object.entries(input.student.cycles).map(
                          ([cycleId, { curriculumId, id }]) => ({
                            where: { id: id || 0 },
                            create: {
                              curriculumId,
                              cycleId,
                            },
                            update: {
                              curriculumId,
                            },
                          })
                        ),
                      },
                    },
                    create: {
                      cycles: {
                        create: Object.entries(input.student.cycles).map(
                          ([cycleId, { curriculumId }]) => ({
                            curriculumId,
                            cycleId,
                          })
                        ),
                      },
                    },
                  },
                },
              }
            : undefined),
        })

        const response = await ctx.db.user.update({
          where: { id },
          data,
        })

        if (password) {
          // if password changed
          try {
            await sendPasswordChangedEmail({ email, password })
          } catch (error) {
            console.log('error here', error)
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'تم تعديل البيانات لكن حدث خطأ أثناء إرسال الإيميل',
            })
          }
        }

        return response
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'هذا البريد الإلكتروني مسجل بالفعل',
            })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع',
        })
      }
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      let password: string | undefined = undefined
      if (input.changePassword) {
        const user = await prisma.user.findFirstOrThrow({
          where: { id: ctx.session.user.id },
        })
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

      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          phone: input.phone,
          ...(password ? { password } : {}),
        },
      })
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: { email: input.email },
      })
      if (!user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الحساب غير موجود',
        })
      const expires = add(new Date(), { hours: 24 })
      const { token } = await prisma.resetPasswordToken.create({
        data: { user: { connect: { email: input.email } }, expires },
      })
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
      const passwordToken = await prisma.resetPasswordToken.findFirst({
        where: { token },
      })
      if (!passwordToken)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا التوكين غير موجود',
        })

      // This prisma object will handle hashing passwords
      const prismaWithPasswordUtility = withPassword(prisma)
      await prismaWithPasswordUtility.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: passwordToken.userId },
          data: { password },
        })
        await tx.resetPasswordToken.delete({ where: { token } })
      })

      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deleteFrom('User').where('id', '=', input).execute()
      return true
    }),
})
