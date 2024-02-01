import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { exportSheet } from '~/services/sheet'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { z } from 'zod'
import { QuizType } from '~/kysely/enums'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import { User } from 'next-auth'

const systemExamFilterSchema = z.object({
  type: z.nativeEnum(QuizType).optional(),
  cycleId: z.string().optional(),
  curriculumId: z.string().optional(),
})

function applySystemExamFilters<O>(
  query: SelectQueryBuilder<DB, 'SystemExam', O>,
  filters: z.infer<typeof systemExamFilterSchema>
) {
  return applyFilters(query, filters)
}

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

      const { groups, trackId, courseId, ...data } = input

      let total = 0
      let questions: { questionId: string; weight: number }[] = []
      let usedQuestions = new Set()
      for (const group of groups) {
        for (const question of Object.values(group.questions)) {
          total += question.weight
          if (usedQuestions.has(question.id))
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'هناك أسئلة مكررة',
            })
          questions.push({ questionId: question.id, weight: question.weight })
          usedQuestions.add(question.id)
        }
      }

      const students = await ctx.db
        .selectFrom('UserCycle')
        .leftJoin('User', 'UserCycle.userId', 'User.id')
        .where('User.role', '=', 'STUDENT')
        .where('cycleId', '=', data.cycleId)
        .where('curriculumId', '=', data.curriculumId)
        .select('UserCycle.userId')
        .execute()

      await ctx.db.transaction().execute(async (trx) => {
        const systemExam = await trx
          .insertInto('SystemExam')
          .values(data)
          .returning('id')
          .executeTakeFirstOrThrow()

        const model = await trx
          .insertInto('Model')
          .values({ systemExamId: systemExam!.id })
          .returning('id')
          .executeTakeFirstOrThrow()

        await trx
          .insertInto('ModelQuestion')
          .values(
            questions.map((question, index) => ({
              ...question,
              modelId: model!.id,
              order: index + 1,
            }))
          )
          .execute()

        await trx
          .insertInto('Quiz')
          .values(
            students.map(({ userId }) => ({
              curriculumId: data.curriculumId,
              modelId: model!.id,
              endsAt: data.endsAt,
              total,
              type: data.type,
              examineeId: userId,
              systemExamId: systemExam.id,
            }))
          )
          .execute()
      })

      return true
    }),

  list: protectedProcedure
    .input(
      z.object({
        filters: systemExamFilterSchema.optional(),
        include: z
          .record(
            z.union([
              z.literal('cycle'),
              z.literal('curriculum'),
              z.literal('quizzesCount'),
            ]),
            z.boolean().optional()
          )
          .optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = applyAccessControl(
        applyPagination(
          applySystemExamFilters(
            ctx.db
              .selectFrom('SystemExam')
              .selectAll('SystemExam')
              .$if(!!input.include?.curriculum, (qb) =>
                qb
                  .leftJoin(
                    'Curriculum',
                    'SystemExam.curriculumId',
                    'Curriculum.id'
                  )
                  .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
                  .leftJoin('Course', 'Track.courseId', 'Course.id')
                  .select([
                    'Course.name as courseName',
                    'Curriculum.name as curriculumName',
                  ])
              )
              .$if(!!input.include?.cycle, (qb) =>
                qb
                  .leftJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
                  .select('Cycle.name as cycleName')
              )
              .$if(!!input.include?.quizzesCount, (qb) =>
                qb.select(({ selectFrom }) => [
                  selectFrom('Quiz')
                    .whereRef('SystemExam.id', '=', 'Quiz.systemExamId')
                    .select(({ fn }) => [
                      fn.count('Quiz.id').as('quizzesCount'),
                    ])
                    .as('quizzesCount'),
                ])
              ),
            input.filters || {}
          ),
          input.pagination
        ),
        ctx.session.user
      )
      return await query.execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: systemExamFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applySystemExamFilters(
        ctx.db
          .selectFrom('SystemExam')
          .select(({ fn }) => fn.count('id').as('total')),
        input.filters
      )
      const total = Number((await query.executeTakeFirst())?.total)
      return total
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
      await ctx.db.deleteFrom('SystemExam').where('id', '=', input).execute()
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

      await ctx.db.deleteFrom('SystemExam').where('id', 'in', input).execute()
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.deleteFrom('SystemExam').execute()
    return true
  }),
})
