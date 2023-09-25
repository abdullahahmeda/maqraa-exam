import { ZodError, z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { checkMutate, db, checkRead } from './helper'
import { editUserSchema } from '~/validation/editUserSchema'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { newUserSchema } from '~/validation/newUserSchema'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { getFields } from '~/services/sheets'
import { GaxiosError } from 'gaxios'
import { studentSchema } from '~/validation/studentSchema'
import { generate as generatePassword } from 'generate-password'
import { prisma } from '~/server/db'
import { sendMail, sendPasswordChangedEmail } from '~/utils/email'
import { getBaseUrl } from '~/utils/api'
import { updateProfileSchema } from '~/validation/updateProfileSchema'
import { compareSync } from 'bcryptjs'
import { recoverPasswordSchema } from '~/validation/recoverPasswordSchema'

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
  createUser: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, name, role, phone } = input
      const data = Prisma.validator<Prisma.UserCreateInput>()({
        name,
        email,
        password,
        role,
        phone,
        ...(role !== 'STUDENT'
          ? {
              corrector: {
                create:
                  role === 'CORRECTOR'
                    ? {
                        ...input.corrector,
                        courses: {
                          create: input.corrector.courses.map((courseId) => ({
                            courseId,
                          })),
                        },
                      }
                    : {},
              },
            }
          : undefined),
        ...(role === 'STUDENT'
          ? {
              student: {
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
            }
          : undefined),
      })
      const user = await checkMutate(db(ctx).user.create({ data }))

      await sendMail({
        subject: 'تم إضافة حسابك في المقرأة!',
        to: [{ email }],
        textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}/login`,
      })

      return user
    }),

  importStudents: protectedProcedure
    .input(importUsersSchema)
    .mutation(async ({ ctx, input }) => {
      const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

      let rows
      try {
        rows = await getFields(spreadsheetId, input.sheet)
      } catch (error) {
        throw googleSheetErrorHandler(error)
      }

      for (const [i, row] of rows.entries()) {
        if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆

        const curriculum = await checkRead(
          db(ctx).curriculum.findFirst({
            where: {
              name: row[4]?.trim(),
              track: { course: { name: row[2]?.trim() } },
            },
          })
        )

        if (!curriculum)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `المنهج ${row[4]} غير موجود`,
          })

        try {
          const student = studentSchema.parse(
            {
              name: row[0],
              phone: row[1],
              email: row[5],
            },
            { path: [i + 1] }
          )
          let s = await checkRead(
            db(ctx).student.findFirst({
              where: { user: { email: student.email } },
            })
          )
          const password = generatePassword()
          // TODO: send email for the user

          // await sendMail({
          //   subject: 'تم إضافة حسابك في المقرأة!',
          //   to: [{ email }],
          //   textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}/login`,
          // })
          if (!s)
            s = (await checkMutate(
              db(ctx).student.create({
                data: {
                  user: {
                    create: {
                      ...student,
                      password,
                      role: 'STUDENT',
                    },
                  },
                },
              })
            ))!
          await checkMutate(
            db(ctx).studentCycle.create({
              data: {
                cycle: {
                  connect: { id: input.cycleId },
                },
                curriculum: {
                  connect: { id: curriculum.id },
                },
                student: {
                  connect: { id: s.id },
                },
              },
            })
          )
        } catch (error: any) {
          if (error instanceof ZodError) {
            const issue = error.issues[0]!

            const [rowNumber, field] = issue.path

            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
              cause: issue,
            })
          } else if (
            error?.cause instanceof Prisma.PrismaClientKnownRequestError
          ) {
            console.log(error)
            if (error.cause.code === 'P2002')
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `خطأ في الصف رقم ${
                  i + 1
                }: هذا الطالب مسجل بالفعل في هذه الدورة`,
              })
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'حدث خطأ غير متوقع',
          })
        }
      }

      // return checkMutate(
      //   db(ctx).studentCycle.create({
      //     data: users,
      //   })
      // )
    }),

  updateUser: protectedProcedure
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

        const response = await checkMutate(
          db(ctx).user.update({
            where: { id },
            data,
          })
        )

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

  updateUserProfile: protectedProcedure
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

      return checkMutate(
        db(ctx).user.update({
          where: { id: ctx.session.user.id },
          data: {
            name: input.name,
            phone: input.phone,
            ...(password ? { password } : {}),
          },
        })
      )
    }),

  recoverPassword: publicProcedure
    .input(recoverPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: { email: input.email },
      })
      if (!user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الحساب غير موجود',
        })
      
      return true
    }),
})
