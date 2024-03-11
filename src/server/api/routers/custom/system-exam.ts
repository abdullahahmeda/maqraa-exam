import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { exportSheet } from '~/services/sheet'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { z } from 'zod'
import { paginationSchema } from '~/utils/db'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import { User } from 'next-auth'
import { UserService } from '~/services/user'
import { SystemExamService } from '~/services/system-exam'
import { filtersSchema, includeSchema } from '~/validation/queries/system-exam'

function applyAccessControl<O>(
  query: SelectQueryBuilder<DB, 'SystemExam', O>,
  user: User
) {
  if (user.role !== 'ADMIN')
    return query
      .whereRef('SystemExam.curriculumId', 'in', ({ selectFrom }) =>
        selectFrom('UserCycle')
          .select('UserCycle.curriculumId')
          .where('UserCycle.userId', '=', user.id)
      )
      .whereRef('SystemExam.cycleId', 'in', ({ selectFrom }) =>
        selectFrom('UserCycle')
          .select('UserCycle.cycleId')
          .where('UserCycle.userId', '=', user.id)
      )
  return query
}

export const systemExamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newSystemExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      const {
        groups,
        trackId,
        courseId,
        questions: _questions,
        isInsideShaded,
        ...data
      } = input

      const questions = _questions.reduce((acc, q) => ({ ...acc, ...q }), {})
      const questionsCount = Object.keys(questions).length
      const groupsQuestionsCount = groups.reduce(
        (acc, g) => acc + Object.values(g.questions).length,
        0
      )

      if (questionsCount !== groupsQuestionsCount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هناك أسئلة مكررة، قم بحذفها ثم حاول مجدداً',
        })
      }

      const total = Object.values(questions).reduce(
        (acc, q) => acc + q.grade,
        0
      )

      const userService = new UserService(ctx.db)

      const students = await userService.getList({
        filters: {
          role: 'STUDENT',
          userCycle: {
            cycleId: data.cycleId,
            curriculumId: data.curriculumId,
          },
        },
      })

      if (students.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'لا يوجد طلاب مشتركين في هذه الدورة ومن نفس المنهج',
        })
      }

      await ctx.db.transaction().execute(async (trx) => {
        const systemExam = await trx
          .insertInto('SystemExam')
          .values(data)
          .returning('id')
          .executeTakeFirstOrThrow()

        const model = await trx
          .insertInto('Model')
          .values({ systemExamId: systemExam.id })
          .returning('id')
          .executeTakeFirstOrThrow()

        await trx
          .insertInto('ModelQuestion')
          .values(
            Object.values(questions).map((question, index) => ({
              questionId: question.id,
              weight: question.grade,
              modelId: model.id,
              order: index + 1,
            }))
          )
          .execute()

        await trx
          .insertInto('Quiz')
          .values(
            students.map(({ id }) => ({
              curriculumId: data.curriculumId,
              modelId: model!.id,
              endsAt: data.endsAt,
              total,
              type: data.type,
              examineeId: id,
              systemExamId: systemExam.id,
            }))
          )
          .execute()
      })

      return true
    }),

  list: protectedProcedure
    .input(
      z
        .object({
          filters: filtersSchema.optional(),
          include: includeSchema.optional(),
          pagination: paginationSchema.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const systemExamService = new SystemExamService(ctx.db)
      const count = await systemExamService.getCount(input?.filters)

      let query = await systemExamService.getListQuery({
        filters: input?.filters,
        include: input?.include,
      })
      query = applyAccessControl(query, ctx.session.user)
      if (input?.pagination) {
        const { pageSize, pageIndex } = input.pagination
        query = query.limit(pageSize).offset(pageIndex * pageSize)
      }
      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),
  count: protectedProcedure
    .input(z.object({ filters: filtersSchema.optional() }).optional())
    .query(async ({ ctx, input }) => {
      const systemExamService = new SystemExamService(ctx.db)
      const count = await systemExamService.getCount(input?.filters)
      return count
    }),

  export: protectedProcedure
    .input(exportSystemExamsSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const { cycleId } = input

      const quizzes = await ctx.db
        .selectFrom('Quiz')
        .leftJoin('SystemExam', 'Quiz.systemExamId', 'SystemExam.id')
        .leftJoin('User as examinee', 'Quiz.examineeId', 'examinee.id')
        .leftJoin('User as corrector', 'Quiz.correctorId', 'corrector.id')
        .selectAll('Quiz')
        .select([
          'SystemExam.name as systemExamName',
          'examinee.name as examineeName',
          'examinee.email as examineeEmail',
          'corrector.name as correctorName',
        ])
        .where('Quiz.systemExamId', 'is not', null)
        .where('SystemExam.cycleId', '=', cycleId)
        .execute()

      return exportSheet(quizzes, (q) => ({
        الإختبار: q.systemExamName,
        الطالب: q.examineeName,
        'إيميل الطالب': q.examineeEmail,
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
        المصحح: q.correctorName,
      }))
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const systemExamService = new SystemExamService(ctx.db)
      await systemExamService.delete(input)
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

      const systemExamService = new SystemExamService(ctx.db)
      await systemExamService.delete(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })

    const systemExamService = new SystemExamService(ctx.db)
    await systemExamService.delete(undefined)
    return true
  }),
})
