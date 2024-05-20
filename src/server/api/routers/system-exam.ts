import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { exportSheet } from '~/services/sheet'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { z } from 'zod'
import { applyPagination, paginationSchema } from '~/utils/db'
import {
  type ExpressionBuilder,
  SelectQueryBuilder,
  sql,
  Expression,
  SqlBool,
} from 'kysely'
import type { DB } from '~/kysely/types'
import { type User } from 'next-auth'
import { UserService } from '~/services/user'
import { SystemExamService } from '~/services/system-exam'
import {
  filtersSchema,
  includeSchema,
} from '~/validation/backend/queries/system-exam'
import { listExamsSchema } from '~/validation/backend/queries/exam/list'
import {
  type IncludeSchema,
  type FiltersSchema,
} from '~/validation/backend/queries/exam/common'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { createExamSchema } from '~/validation/backend/mutations/exam/create'

function applyAccessControl<O>(
  query: SelectQueryBuilder<DB, 'SystemExam', O>,
  user: User,
) {
  if (user.role !== 'ADMIN')
    return query
      .whereRef('SystemExam.curriculumId', 'in', ({ selectFrom }) =>
        selectFrom('UserCycle')
          .select('UserCycle.curriculumId')
          .where('UserCycle.userId', '=', user.id),
      )
      .whereRef('SystemExam.cycleId', 'in', ({ selectFrom }) =>
        selectFrom('UserCycle')
          .select('UserCycle.cycleId')
          .where('UserCycle.userId', '=', user.id),
      )
  return query
}

function applyInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    return [
      ...(include?.cycle
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Cycle')
                .selectAll('Cycle')
                .whereRef('SystemExam.cycleId', '=', 'Cycle.id'),
            ).as('cycle'),
          ]
        : []),
      ...(include?.curriculum
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Curriculum')
                .selectAll('Curriculum')
                .whereRef('Curriculum.id', '=', 'SystemExam.curriculumId')
                .select((eb) => [
                  ...(typeof include.curriculum !== 'boolean' &&
                  include.curriculum?.track
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Track')
                            .selectAll('Track')
                            .whereRef('Curriculum.trackId', '=', 'Track.id')
                            .select((eb) => [
                              ...(typeof include.curriculum !== 'boolean' &&
                              typeof include.curriculum?.track !== 'boolean' &&
                              include.curriculum?.track?.course
                                ? [
                                    jsonObjectFrom(
                                      eb
                                        .selectFrom('Course')
                                        .selectAll('Course')
                                        .whereRef(
                                          'Track.courseId',
                                          '=',
                                          'Course.id',
                                        ),
                                    ).as('course'),
                                  ]
                                : []),
                            ]),
                        ).as('track'),
                      ]
                    : []),
                ]),
            ).as('curriculum'),
          ]
        : []),
    ]
  }
}

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.curriculumId)
      where.push(eb('SystemExam.curriculumId', '=', filters.curriculumId))
    if (filters?.cycleId)
      where.push(eb('SystemExam.cycleId', '=', filters.cycleId))
    if (filters?.type) where.push(eb('SystemExam.type', '=', filters.type))
    return eb.and(where)
  }
}

export const systemExamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      const { questions, isInsideShaded, ...data } = input

      const questionsCount = questions.length

      const total = questions.reduce((acc, q) => acc + q.weight, 0)

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
        const model = await trx
          .insertInto('Model')
          .expression(() => sql`DEFAULT VALUES`)
          .returning('id')
          .executeTakeFirstOrThrow()

        const systemExam = await trx
          .insertInto('SystemExam')
          .values({ ...data, defaultModelId: model.id })
          .returning('id')
          .executeTakeFirstOrThrow()

        await trx
          .insertInto('ModelQuestion')
          .values(
            questions.map((question, index) => ({
              questionId: question.id,
              weight: question.weight,
              modelId: model.id,
              order: index + 1,
            })),
          )
          .execute()

        await trx
          .insertInto('Quiz')
          .values(
            students.map(({ id }) => ({
              curriculumId: data.curriculumId,
              modelId: model.id,
              endsAt: data.endsAt,
              total,
              type: data.type,
              examineeId: id,
              systemExamId: systemExam.id,
            })),
          )
          .execute()
      })

      return true
    }),

  list: protectedProcedure
    .input(listExamsSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)
      const whereCanRead = (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
        const conds = []
        if (ctx.session.user.role !== 'ADMIN')
          conds.push(
            eb.exists(
              eb
                .selectFrom('UserCycle')
                .where('UserCycle.userId', '=', ctx.session.user.id)
                .whereRef(
                  'UserCycle.curriculumId',
                  '=',
                  'SystemExam.curriculumId',
                )
                .whereRef('UserCycle.cycleId', '=', 'SystemExam.cycleId'),
            ),
          )
        return eb.and(conds)
      }

      const count = Number(
        (
          await ctx.db
            .selectFrom('SystemExam')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .where(whereCanRead)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('SystemExam')
          .selectAll('SystemExam')
          .select(applyInclude(input?.include))
          .where(where)
          .where(whereCanRead),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),
  // count: protectedProcedure
  //   .input(z.object({ filters: filtersSchema.optional() }).optional())
  //   .query(async ({ ctx, input }) => {
  //     const systemExamService = new SystemExamService(ctx.db)
  //     const count = await systemExamService.getCount(input?.filters)
  //     return count
  //   }),

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
