import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { prisma } from '~/server/db'
import { exportSheet } from '~/services/sheet'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { SystemExamService } from '~/services/systemExam'
import { db } from './helper'

export const systemExamRouter = createTRPCRouter({
  createSystemExam: protectedProcedure
    .input(newSystemExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      const systemExamService = new SystemExamService(prisma)
      return await systemExamService.create(input)
    }),

  exportSystemExams: protectedProcedure
    .input(exportSystemExamsSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const { cycleId } = input

      const quizzes = await prisma.quiz.findMany({
        where: { systemExamId: { not: null }, systemExam: { cycleId } },
        include: {
          examinee: true,
          corrector: true,
          curriculum: { include: { track: { select: { course: true } } } },
          systemExam: true,
        },
      })

      return exportSheet(quizzes, (q) => ({
        الإختبار: q.systemExam!.name,
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
