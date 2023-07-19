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
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { ExamInputSchema } from '@zenstackhq/runtime/zod/input'
import { checkMutate, checkRead, db } from './helper'
import { ExamWhereInputObjectSchema } from '.zenstack/zod/objects'
import { newExamSchema } from '~/validation/newExamSchema'
import { Prisma, QuestionType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import sampleSize from 'lodash.samplesize'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { isCorrectAnswer } from '~/utils/strings'
import { correctExamSchema } from '~/validation/correctExamSchema'

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
  create: publicProcedure
    .input(newExamSchema)
    .mutation(async ({ ctx, input }) => {
      const { groups: _groups, trackId, ...data } = input

      const curriculum = await checkRead(
        db(ctx).curriculum.findFirst({
          where: { id: data.curriculumId },
          include: { parts: true },
        })
      )

      if (!curriculum)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا المنهج غير موجود',
        })

      const parts = curriculum.parts.map((part) => ({
        partNumber: part.number,
        hadithNumber: {
          gte: part.from,
          lte: part.to,
        },
      }))

      let usedQuestions: string[] = []
      let usedHathidths: number[] = []

      const groups = await Promise.all(
        _groups.map(async (g, i) => {
          let styleQuery =
            g.styleOrType === QuestionType.MCQ ||
            g.styleOrType === QuestionType.WRITTEN
              ? { type: g.styleOrType || undefined }
              : { style: g.styleOrType || undefined }

          console.log(styleQuery)

          const questions = []
          const allPossibleQuestions = await checkRead(
            db(ctx).question.findMany({
              where: {
                AND: [
                  { courseId: data.courseId },
                  { id: { notIn: usedQuestions } },
                  { OR: parts },
                  { difficulty: g.difficulty || undefined },
                  styleQuery,
                  { hadithNumber: { notIn: usedHathidths } },
                ],
              },
              take: g.number,
              select: { id: true, hadithNumber: true },
            })
          )

          if (allPossibleQuestions.length < g.number)
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `أقصى عدد مسموح للأسئلة في المجموعة ${i + 1} هو ${
                allPossibleQuestions.length
              }`,
              cause: new z.ZodError([
                {
                  code: z.ZodIssueCode.too_big,
                  maximum: allPossibleQuestions.length,
                  inclusive: true,
                  type: 'number',
                  message: `أقصى عدد مسموح للأسئلة في المجموعة ${i + 1} هو ${
                    allPossibleQuestions.length
                  }`,
                  path: ['groups', i, 'number'],
                },
              ]).issues[0],
            })

          const _questions = sampleSize(allPossibleQuestions, g.number)

          for (let [i, q] of _questions.entries()) {
            usedQuestions.push(q.id)
            if (!data.repeatFromSameHadith) usedHathidths.push(q.hadithNumber)
            questions.push({
              question: { connect: { id: q.id } },
              order: i + 1,
            })
          }

          return {
            ...g,
            order: i + 1,
            questions: { create: questions },
          }
        })
      )

      return checkMutate(
        db(ctx).exam.create({
          data: {
            ...data,
            studentId: ctx.session?.user.id,
            groups: { create: groups },
          },
        })
      )
    }),

  submit: publicProcedure
    .input(submitExamSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, groups } = input
      const exam = await checkRead(db(ctx).exam.findFirst({ where: { id } }))

      if (!exam)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار غير موجود',
        })

      if (exam.submittedAt)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار تم تسليمه من قبل',
        })

      let grade = 0
      const update = await Promise.all(
        Object.entries(groups).map(async ([groupId, { questions }]) => ({
          where: { id: groupId },
          data: {
            questions: {
              update: await Promise.all(
                Object.entries(questions).map(async ([questionId, answer]) => {
                  const examQuestion = await checkRead(
                    db(ctx).groupQuestion.findFirstOrThrow({
                      where: { id: Number(questionId) },
                      include: { question: true, group: true },
                    })
                  )

                  const isCorrect =
                    answer === undefined
                      ? false
                      : isCorrectAnswer(examQuestion.question, answer)
                  grade +=
                    Number(isCorrect) * examQuestion.group.gradePerQuestion

                  return {
                    where: { id: Number(questionId) },
                    data: { answer, isCorrect },
                  }
                })
              ),
            },
          },
        }))
      )

      return checkMutate(
        db(ctx).exam.update({
          where: { id },
          data: {
            submittedAt: new Date(),
            grade,
            groups: { update },
          },
        })
      )
    }),

  correct: protectedProcedure
    .input(correctExamSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, groups } = input

      let grade = 0
      const update = await Promise.all(
        Object.entries(groups).map(async ([groupId, { questions }]) => ({
          where: { id: groupId },
          data: {
            questions: {
              update: await Promise.all(
                Object.entries(questions).map(
                  async ([questionId, isCorrect]) => {
                    const examQuestion = await checkRead(
                      db(ctx).groupQuestion.findFirstOrThrow({
                        where: { id: Number(questionId) },
                        include: { question: true, group: true },
                      })
                    )
                    grade +=
                      Number(isCorrect) * examQuestion.group.gradePerQuestion

                    return {
                      where: { id: Number(questionId) },
                      data: { isCorrect },
                    }
                  }
                )
              ),
            },
          },
        }))
      )

      return checkMutate(
        db(ctx).exam.update({
          where: { id },
          data: {
            correctedAt: new Date(),
            correctorId: ctx.session.user.id,
            grade,
            groups: { update },
          },
        })
      )
    }),
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

  // update: protectedProcedure
  //   .input(ExamInputSchema.update)
  //   .mutation(async ({ ctx, input }) =>
  //     checkMutate(db(ctx).exam.update(input))
  //   ),
})
