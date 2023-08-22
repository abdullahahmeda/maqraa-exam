import { ZodError, z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { UserInputSchema } from '@zenstackhq/runtime/zod/input'
import { checkMutate, db, checkRead } from './helper'
import { UserWhereInputObjectSchema } from '.zenstack/zod/objects'
import { updateUserSchema } from '~/validation/updateUserSchema'
import { Prisma, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { newUserSchema } from '~/validation/newUserSchema'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { getFields } from '~/services/sheets'
import { GaxiosError } from 'gaxios'
import { studentSchema } from '~/validation/studentSchema'
import { generate as generatePassword } from 'generate-password'
import { prisma } from '~/server/db'
import { sendMail } from '~/utils/email'
import { getBaseUrl } from '~/utils/api'

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

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ ctx, input }) => {
      const password = generatePassword()
      const { email, name, role, phone } = input
      const data = Prisma.validator<Prisma.UserCreateInput>()({
        name,
        email,
        password,
        role,
        phone,
        ...(role !== 'STUDENT'
          ? {
              corrector: {
                create: role === 'CORRECTOR' ? input.corrector : {},
              },
            }
          : undefined),
        ...(role === 'STUDENT'
          ? {
              student: { create: {} },
            }
          : undefined),
      })
      const user = await checkMutate(db(ctx).user.create({ data }))

      await sendMail({
        subject: 'كلمة المرور الخاصة بك في المقرأة',
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
            where: { name: row[4], track: { course: { name: row[2] } } },
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

  count: protectedProcedure
    .input(z.object({ where: UserWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) =>
      checkRead(db(ctx).user.count(input as any))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).user.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(UserInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).user.findFirst(input as any))),

  findFirstOrThrow: protectedProcedure
    .input(UserInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).user.findFirstOrThrow(input as any))
    ),

  findMany: protectedProcedure
    .input(UserInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).user.findMany(input as any))),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, email, name, role, phone } = input
        const data = Prisma.validator<Prisma.UserUpdateInput>()({
          name,
          email,
          role,
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
                        ? input.corrector
                        : { cycleId: null, courseId: null }),
                    },
                    create: {
                      ...(role === 'CORRECTOR'
                        ? input.corrector
                        : { cycleId: null, courseId: null }),
                    },
                  },
                },
              }
            : undefined),
          ...(role === 'STUDENT'
            ? {
                student: {
                  connectOrCreate: { where: { userId: id }, create: {} },
                },
              }
            : undefined),
        })

        return checkMutate(
          db(ctx).user.update({
            where: { id },
            data,
          })
        )
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
})
