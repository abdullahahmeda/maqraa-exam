import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { checkMutate, checkRead, db } from './helper'
import { newQuizSchema } from '~/validation/newQuizSchema'
import { QuestionType, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { correctQuestion } from '~/utils/strings'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { prisma } from '~/server/db'
import { QuizService } from '~/services/quiz'
import { SystemExamService } from '~/services/systemExam'
import { editQuizSchema } from '~/validation/editQuizSchema'
import { exportSheet } from '~/services/sheet'

export const quizRouter = createTRPCRouter({
  createQuiz: publicProcedure
    .input(newQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const { groups: _groups, courseId, trackId, ...data } = input

      const quizService = new QuizService(db(ctx))

      return await quizService.create({
        ...input,
        examineeId: ctx.session?.user.id,
      })
    }),

  createSystemExam: protectedProcedure
    .input(newSystemExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== UserRole.ADMIN)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      const systemExamService = new SystemExamService(db(ctx))
      return await systemExamService.create(input)
    }),

  submitExam: publicProcedure
    .input(submitExamSchema)
    .mutation(async ({ ctx, input }) => {
      const quizService = new QuizService(db(ctx))
      return await quizService.submit({
        ...input,
        examineeId: ctx.session?.user.id,
      })
    }),

  correctExam: protectedProcedure
    .input(correctQuizSchema)
    .mutation(async ({ input, ctx }) => {
      const quizService = new QuizService(db(ctx))
      return await quizService.correct({
        ...input,
        correctorId: ctx.session.user.id,
      })
    }),

  updateQuiz: protectedProcedure
    .input(editQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const quizService = new QuizService(db(ctx))
      return await quizService.update(input)
    }),

  exportQuizzes: protectedProcedure
    .input(z.object({ systemExamId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const { systemExamId } = input

      const quizzes = await prisma.quiz.findMany({ where: { systemExamId } })

      return exportSheet(questions, (q) => ({
        'رقم السؤال': q.number,
        'رقم الصفحة': q.pageNumber,
        'رقم الجزء': q.partNumber,
        'رقم الحديث': q.hadithNumber,
        'نوع السؤال': enTypeToAr(q.type),
        'طريقة السؤال': enStyleToAr(q.style),
        'مستوى السؤال': enDifficultyToAr(q.difficulty),
        السؤال: q.text,
        صح: q.textForTrue,
        خطأ: q.textForFalse,
        خيار1: q.option1,
        خيار2: q.option2,
        خيار3: q.option3,
        خيار4: q.option4,
        الإجابة: q.answer,
        'هل يوجد إجابة أخرى': q.anotherAnswer,
        'داخل المظلل': q.isInsideShaded ? 'نعم' : 'لا',
        'يستهدف السؤال': q.objective,
      }))
    }),
})
