// import { TRPCError } from '@trpc/server'
// import { z } from 'zod'
// import { QuestionDifficulty } from '~/constants'
// import {
//   createExam,
//   deleteExam,
//   getExam,
//   getExamToSolve,
//   getPaginatedExams,
//   saveExam,
//   sendGradeEmail,
//   submitExam,
// } from '~/services/exams'
// import { sendMail } from '~/utils/email'
// import { logErrorToLogtail } from '~/utils/logtail'
// import { newExamSchema } from '~/validation/newExamSchema'
// import { prisma } from '~/server/db'
// import {
//   adminOnlyProcedure,
//   createTRPCRouter,
//   protectedProcedure,
//   publicProcedure,
// } from '../trpc'

import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { ExamInputSchema } from '@zenstackhq/runtime/zod/input'
import { checkMutate, checkRead, db } from './helper'
import { ExamWhereInputObjectSchema } from '.zenstack/zod/objects'

// const filtersSchema = z
//   .object({
//     graded: z
//       .union([z.literal(''), z.literal('yes'), z.literal('no')])
//       .optional(),
//     grade: z.union([z.literal(''), z.number().int().nonnegative()]).optional(),
//     difficulty: z
//       .union([z.literal(''), z.nativeEnum(QuestionDifficulty)])
//       .optional(),
//   })
//   .optional()

// export type FilterSchema = z.infer<typeof filtersSchema>

// export const examsRouter = createTRPCRouter({
//   list: adminOnlyProcedure
//     .input(
//       z.object({
//         page: z.number().positive().int().optional(),
//         filters: filtersSchema,
//       })
//     )
//     .query(async ({ input }) => {
//       const pageSize = 50
//       const page = input.page || 1
//       const filters: Required<FilterSchema> = {
//         graded: '',
//         grade: '',
//         difficulty: '',
//         ...input.filters,
//       }!

//       return await getPaginatedExams({ page, pageSize, filters })
//     }),
//   get: adminOnlyProcedure
//     .input(
//       z.object({
//         id: z.string().cuid().min(1),
//       })
//     )
//     .query(async ({ input }) => {
//       let exam
//       try {
//         exam = await getExam(input.id)
//       } catch (error) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return exam
//     }),
//   getToSolve: protectedProcedure
//     .input(
//       z.object({
//         id: z.string().cuid().min(1),
//       })
//     )
//     .query(async ({ input, ctx }) => {
//       let exam
//       try {
//         exam = await getExamToSolve(input.id, ctx.session.user.id)
//       } catch (error) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }

//       if (!exam)
//         throw new TRPCError({
//           code: 'NOT_FOUND',
//           message: 'هذا الاختبار غير موجود',
//         })

//       // Unreachable because `exam = await getExamToSolve(input.id, ctx.session.user.id)`
//       //                                                            ~~~~~~~~~~~~~~~~~~~

//       // if (exam.userId !== ctx.session.user.id)
//       //   throw new TRPCError({
//       //     code: 'UNAUTHORIZED',
//       //     message: 'هذا الاختبار ليس خاصاً بك'
//       //   })
//       return exam
//     }),
//   create: protectedProcedure
//     .input(newExamSchema)
//     .mutation(async ({ input, ctx }) => {
//       let exam
//       try {
//         exam = await createExam(
//           input.difficulty,
//           input.course,
//           input.curriculum,
//           ctx.session.user
//         )
//       } catch (error) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return exam
//     }),

//   submit: protectedProcedure
//     .input(
//       z.object({
//         id: z.string().cuid().min(1),
//         answers: z.record(z.string().nullable()),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const exam = await prisma.exam.findFirst({
//         where: {
//           id: input.id,
//         },
//       })

//       if (!exam)
//         throw new TRPCError({
//           code: 'NOT_FOUND',
//           message: 'هذا الاختبار غير موجود',
//         })

//       if (exam.submittedAt)
//         throw new TRPCError({
//           code: 'BAD_REQUEST',
//           message: 'هذا الاختبار تم تسليمه من قبل',
//         })

//       if (exam.userId !== ctx.session.user.id)
//         throw new TRPCError({
//           code: 'UNAUTHORIZED',
//           message: 'هذا الاختبار ليس خاصاً بك',
//         })

//       try {
//         await submitExam(input.id, input.answers)
//       } catch (error: any) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
//   save: adminOnlyProcedure
//     .input(
//       z.object({
//         id: z.string().cuid().min(1),
//         questions: z.record(z.boolean()),
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         await saveExam(input.id, input.questions)
//       } catch (error: any) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       let isEmailSent = true
//       try {
//         await sendGradeEmail(input.id)
//       } catch (error) {
//         isEmailSent = false
//       }
//       return isEmailSent
//     }),
//   delete: adminOnlyProcedure
//     .input(
//       z.object({
//         id: z.string().cuid().min(1),
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         await deleteExam(input.id)
//       } catch (error) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
// })

export const examsRouter = createTRPCRouter({
  // TODO: `select distinct pageNumber` so only 1 question fron each hadith
  create: protectedProcedure
    .input(ExamInputSchema.create)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).exam.create(input))
    ),

  count: protectedProcedure
    .input(z.object({ where: ExamWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) => checkRead(db(ctx).exam.count(input))),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).exam.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(ExamInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirst(input))),

  findFirstOrThrow: protectedProcedure
    .input(ExamInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirstOrThrow(input))),

  findMany: protectedProcedure
    .input(ExamInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).exam.findMany(input))),

  update: protectedProcedure
    .input(ExamInputSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).exam.update(input))
    ),
})
