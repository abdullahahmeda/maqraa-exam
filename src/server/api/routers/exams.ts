import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { ExamInputSchema } from '@zenstackhq/runtime/zod/input'
import { checkMutate, checkRead, db } from './helper'
import { ExamWhereInputObjectSchema } from '.zenstack/zod/objects'
import { newExamSchema } from '~/validation/newExamSchema'
import { ExamType, QuestionType, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { isCorrectAnswer } from '~/utils/strings'
import { correctExamSchema } from '~/validation/correctExamSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { prisma } from '~/server/db'

export const examsRouter = createTRPCRouter({
  // TODO: `select distinct pageNumber` so only 1 question fron each hadith
  createPublic: publicProcedure
    .input(newExamSchema)
    .mutation(async ({ ctx, input }) => {
      const { groups: _groups, courseId, trackId, ...data } = input

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

          const allPossibleQuestions = await checkRead(
            db(ctx).question.findMany({
              where: {
                AND: [
                  { courseId: courseId },
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

          return {
            ...g,
            order: i + 1,
          }
        })
      )

      return checkMutate(
        db(ctx).exam.create({
          data: {
            ...data,
            userId: ctx.session?.user.id,
            type: ExamType.PUBLIC,
            groups: { create: groups },
          },
        })
      )
    }),

  createSystem: protectedProcedure
    .input(newSystemExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== UserRole.ADMIN)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      const { groups: _groups, trackId, courseId, cycleId, ...data } = input

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

      const cycle = await prisma.cycle.findFirst({
        where: { id: cycleId },
      })

      if (!cycle)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الدورة غير موجودة',
        })

      const studentUsers = await prisma.user.findMany({
        where: {
          student: {
            cycles: {
              some: {
                cycleId,
                curriculumId: data.curriculumId,
              },
            },
          },
        },
      })

      const parts = curriculum.parts.map((part) => {
        let hadithNumber
        if (data.type === ExamType.FULL)
          hadithNumber = {
            gte: part.from,
            lte: part.to,
          }
        else if (data.type === ExamType.FIRST_MEHWARY)
          hadithNumber = {
            gte: part.from,
            lte: part.mid,
          }
        else if (data.type === ExamType.SECOND_MEHWARY)
          hadithNumber = {
            gte: Math.min(part.mid + 1, part.to),
            lte: part.to,
          }
        return {
          partNumber: part.number,
          hadithNumber,
        }
      })

      let usedQuestions: string[] = []
      let usedHathidths: number[] = []

      const groups = await Promise.all(
        _groups.map(async (g, i) => {
          let styleQuery =
            g.styleOrType === QuestionType.MCQ ||
            g.styleOrType === QuestionType.WRITTEN
              ? { type: g.styleOrType || undefined }
              : { style: g.styleOrType || undefined }

          const allPossibleQuestions = await checkRead(
            db(ctx).question.findMany({
              where: {
                AND: [
                  { courseId },
                  { id: { notIn: usedQuestions } },
                  { OR: parts },
                  { difficulty: g.difficulty || undefined },
                  styleQuery,
                  { hadithNumber: { notIn: usedHathidths } },
                ],
              },
              // take: g.number,
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

          return {
            ...g,
            order: i + 1,
          }
        })
      )

      for (const user of studentUsers) {
        // console.log(user)
        checkMutate(
          db(ctx).exam.create({
            data: {
              ...data,
              cycleId,
              userId: user.id,
              groups: { create: groups },
            },
          })
        )
      }
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

      if (ctx.session?.user.id !== exam.userId)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
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

  enter: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input: id }) => {
      const _exam = await checkRead(
        db(ctx).exam.findFirst({
          where: { id },
          include: {
            groups: {
              include: {
                questions: {
                  select: {
                    question: true,
                    order: true,
                    id: true,
                    answer: true,
                    isCorrect: true,
                  },
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        })
      )

      if (!_exam)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الإختبار غير موجود',
        })

      let exam
      // hide answers if exam is not submitted
      if (!_exam.submittedAt)
        exam = {
          ..._exam,
          groups: _exam.groups.map((g) => ({
            ...g,
            questions: g.questions.map((q) => ({
              ...q,
              question: {
                ...q.question,
                answer: undefined,
                anotherAnswer: undefined,
                isInsideShaded: undefined,
              },
            })),
          })),
        }
      else return _exam

      if (!exam.enteredAt) {
        prisma.exam.update({ where: { id }, data: { enteredAt: new Date() } })
      }

      return exam
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
            corrector: { connect: { id: ctx.session.user.correctorId } },
            grade,
            groups: { update },
          },
        })
      )
    }),
  count: protectedProcedure
    .input(z.object({ where: ExamWhereInputObjectSchema }).optional())
    .query(async ({ ctx, input }) =>
      checkRead(db(ctx).exam.count(input as any))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).exam.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(ExamInputSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirst(input as any))),

  findFirstOrThrow: protectedProcedure
    .input(ExamInputSchema.findFirst.optional())
    .query(({ ctx, input }) =>
      checkRead(db(ctx).exam.findFirstOrThrow(input as any))
    ),

  findMany: protectedProcedure
    .input(ExamInputSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).exam.findMany(input as any))),

  // update: protectedProcedure
  //   .input(ExamInputSchema.update)
  //   .mutation(async ({ ctx, input }) =>
  //     checkMutate(db(ctx).exam.update(input))
  //   ),
})
