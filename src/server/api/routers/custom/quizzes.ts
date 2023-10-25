import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { checkMutate, checkRead, db } from './helper'
import { newQuizSchema } from '~/validation/newQuizSchema'
import { TRPCError } from '@trpc/server'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { prisma } from '~/server/db'
import { QuizService } from '~/services/quiz'
import { editQuizSchema } from '~/validation/editQuizSchema'
import { exportSheet } from '~/services/sheet'
import { percentage } from '~/utils/percentage'
import { formatDate } from '~/utils/formatDate'

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

      const quizzes = await prisma.quiz.findMany({
        where: { systemExamId },
        include: {
          examinee: true,
          corrector: true,
          curriculum: { include: { track: { select: { course: true } } } },
        },
      })

      return exportSheet(quizzes, (q) => ({
        الطالب: q.examinee!.name,
        'إيميل الطالب': q.examinee!.email,
        'الدرجة المتوقعة':
          !q.correctedAt && typeof q.grade === 'number' ? q.grade : '',
        الدرجة: q.correctedAt ? q.grade : '',
        'النسبة المئوية المتوقعة':
          !q.correctedAt && typeof q.grade === 'number'
            ? `${percentage(q.grade, q.total as number)}%`
            : '',
        'النسبة المئوية': q.correctedAt
          ? `${percentage(q.grade as number, q.total as number)}%`
          : '',
        'إجمالي الدرجات': q.total,
        'وقت القفل': q.endsAt ? formatDate(q.endsAt) : '',
        'وقت البدأ': q.enteredAt ? formatDate(q.enteredAt) : '',
        'وقت التسليم': q.submittedAt ? formatDate(q.submittedAt) : '',
        'وقت التصحيح': q.correctedAt ? formatDate(q.correctedAt) : '',
        المصحح: q.corrector ? q.corrector.name : '',
      }))
    }),
})
