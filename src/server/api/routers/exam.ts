import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { exportSheet } from '~/services/sheet'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import { z } from 'zod'
import { applyPagination } from '~/utils/db'
import { type ExpressionBuilder, sql } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  applyExamsFilters,
  applyExamsInclude,
  deleteExams,
} from '~/services/exam'
import { listExamsSchema } from '~/validation/backend/queries/exam/list'
import { createExamSchema } from '~/validation/backend/mutations/exam/create'
import { applyUsersFilters } from '~/services/user'
import { applyQuestionsFilters } from '~/services/question'

export const examRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'أنت لا تملك الصلاحيات لهذه العملية',
        })

      if (input.curriculumSelection === 'specific') {
        const { questions, curriculumSelection, isInsideShaded, ...data } =
          input

        const total = questions.reduce((acc, q) => acc + q.weight, 0)

        const students = await ctx.db
          .selectFrom('User')
          .selectAll('User')
          .where(
            applyUsersFilters({
              role: 'STUDENT',
              userCycle: {
                cycleId: data.cycleId,
                curriculumId: data.curriculumId,
              },
            }),
          )
          .execute()

        if (students.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'لا يوجد طلاب مشتركين في هذه الدورة ومن نفس المنهج',
          })
        }

        await ctx.db.transaction().execute(async (trx) => {
          const model = await trx
            .insertInto('Model')
            .values({ total })
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
                type: data.type,
                examineeId: id,
                systemExamId: systemExam.id,
              })),
            )
            .execute()
        })
      } else {
        const total = input.questionsPerExam * input.gradePerQuestion
        const curricula = await ctx.db
          .selectFrom('CycleCurriculum')
          .leftJoin(
            'Curriculum',
            'Curriculum.id',
            'CycleCurriculum.curriculumId',
          )
          .select(['curriculumId', 'name as curriculumName'])
          .where('cycleId', '=', input.cycleId)
          .$narrowType<{ curriculumName: string }>()
          .execute()

        await ctx.db.transaction().execute(async (trx) => {
          for (const { curriculumId, curriculumName } of curricula) {
            const { id: modelId } = await trx
              .insertInto('Model')
              .values({ total })
              .returning('id')
              .executeTakeFirstOrThrow()

            const questionsWhere = await applyQuestionsFilters({
              difficulty: input.difficulty,
              type: input.questionsType,
              curriculum: { id: curriculumId, type: input.type },
            })

            await trx
              .insertInto('ModelQuestion')
              .columns(['modelId', 'order', 'questionId', 'weight'])
              .expression((eb) =>
                eb
                  .selectFrom('Question')
                  .select([
                    sql.lit(modelId).as('modelId'),
                    sql.lit(1).as('order'),
                    'Question.id',
                    sql.lit(input.gradePerQuestion).as('weight'),
                  ])
                  .where(questionsWhere)
                  .limit(input.questionsPerExam)
                  .orderBy(sql`RANDOM()`),
              )
              .execute()

            const { id: systemExamId } = await trx
              .insertInto('SystemExam')
              .values({
                type: input.type,
                cycleId: input.cycleId,
                name: curriculumName,
                curriculumId,
                endsAt: input.endsAt,
                defaultModelId: modelId,
              })
              .returning('SystemExam.id')
              .executeTakeFirstOrThrow()

            const results = await trx
              .insertInto('Quiz')
              .columns(['examineeId', 'systemExamId', 'modelId', 'type'])
              .expression((eb) =>
                eb
                  .selectFrom('User')
                  .select([
                    'id',
                    sql.lit(systemExamId).as('systemExamId'),
                    sql.lit(modelId).as('modelId'),
                    sql.lit(input.type).as('type'),
                  ])
                  .where(
                    applyUsersFilters({
                      role: 'STUDENT',
                      userCycle: {
                        cycleId: input.cycleId,
                        curriculumId,
                      },
                    }),
                  ),
              )
              .executeTakeFirstOrThrow()

            if (Number(results.numInsertedOrUpdatedRows) === 0) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `لا يوجد طلاب مشتركين في هذه الدورة من منهج ${curriculumName}`,
              })
            }
          }
        })
      }

      return true
    }),

  list: protectedProcedure
    .input(listExamsSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyExamsFilters(input?.filters)
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
          .select(applyExamsInclude(input?.include))
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
        .leftJoin('Model', 'Quiz.modelId', 'Model.id')
        .selectAll('Quiz')
        .select([
          'Model.total as total',
          'SystemExam.name as systemExamName',
          'examinee.name as examineeName',
          'examinee.email as examineeEmail',
          'corrector.name as correctorName',
        ])
        .where('Quiz.systemExamId', 'is not', null)
        .where('SystemExam.cycleId', '=', cycleId)
        .$narrowType<{ total: number }>()
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
            ? `${percentage(q.grade, q.total)}%`
            : '',
        'النسبة المئوية': q.correctedAt
          ? `${percentage(q.grade!, q.total)}%`
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

      await deleteExams(input)
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

      await deleteExams(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })

    await deleteExams(undefined)
    return true
  }),
})
