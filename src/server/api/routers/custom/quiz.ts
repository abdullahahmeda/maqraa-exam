import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc'
import { newQuizSchema } from '~/validation/newQuizSchema'
import { TRPCError } from '@trpc/server'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { QuizService } from '~/services/quiz'
import { editQuizSchema } from '~/validation/editQuizSchema'
import { exportSheet } from '~/services/sheet'
import { percentage } from '~/utils/percentage'
import { formatDate } from '~/utils/formatDate'
import { DB } from '~/kysely/types'
import { SelectQueryBuilder } from 'kysely'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { correctQuestion } from '~/utils/strings'

const quizFilterSchema = z.object({
  systemExamId: z.string().nullable().optional(),
})

const quizIncludeSchema = z.record(
  z.union([
    z.literal('examinee'),
    z.literal('curriculum'),
    z.literal('corrector'),
    z.literal('systemExam'),
  ]),
  z.boolean().optional()
)

function applyQuizFilters<O>(
  query: SelectQueryBuilder<DB, 'Quiz', O>,
  filters: z.infer<typeof quizFilterSchema>
) {
  return applyFilters(query, filters)
}

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(newQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const { groups: _groups, courseId, trackId, ...data } = input

      const quizService = new QuizService(db(ctx))

      return await quizService.create({
        ...input,
        examineeId: ctx.session?.user.id,
      })
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('Quiz')
        .selectAll()
        .where('id', '=', input)
        .executeTakeFirst()
    ),

  list: protectedProcedure
    .input(
      z.object({
        filters: quizFilterSchema,
        include: quizIncludeSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .selectFrom('Quiz')
        .selectAll('Quiz')
        .$if(!!input.include?.examinee, (qb) =>
          qb
            .leftJoin('User as examinee', 'Quiz.examineeId', 'examinee.id')
            .select([
              'examinee.name as examineeName',
              'examinee.email as examineeEmail',
            ])
        )
        .$if(!!input.include?.curriculum, (qb) =>
          qb
            .leftJoin('Curriculum', 'Quiz.curriculumId', 'Curriculum.id')
            .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
            .leftJoin('Course', 'Track.courseId', 'Course.id')
            .select([
              'Curriculum.name as curriculumName',
              'Course.name as courseName',
            ])
        )
        .$if(!!input.include?.corrector, (qb) =>
          qb
            .leftJoin('Corrector', 'Quiz.correctorId', 'Corrector.id')
            .leftJoin('User as corrector', 'Corrector.userId', 'corrector.id')
            .select('corrector.name as correctorName')
        )
        .$if(!!input.include?.systemExam, (qb) =>
          qb
            .leftJoin('SystemExam', 'Quiz.systemExamId', 'SystemExam.id')
            .leftJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
            .select([
              'SystemExam.name as systemExamName',
              'Cycle.name as cycleName',
            ])
        )
      return await applyPagination(
        applyQuizFilters(query, input.filters),
        input.pagination
      ).execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: quizFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applyQuizFilters(
        ctx.db
          .selectFrom('Quiz')
          .select(({ fn }) => fn.count('id').as('total')),
        input.filters
      )
      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),

  submit: publicProcedure
    .input(submitExamSchema)
    .mutation(async ({ ctx, input }) => {
      const { answers } = input
      const quiz = await ctx.db
        .selectFrom('Quiz')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirst()

      if (!quiz)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار غير موجود',
        })

      if (quiz.submittedAt)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار تم تسليمه من قبل',
        })

      if (ctx.session?.user.id != quiz.examineeId)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
        })

      const modelQuestions = await ctx.db
        .selectFrom('ModelQuestion')
        .leftJoin('Question', 'ModelQuestion.questionId', 'Question.id')
        .select([
          'ModelQuestion.id',
          'ModelQuestion.weight',
          'Question.answer',
          'Question.type',
        ])
        .execute()

      await ctx.db.transaction().execute(async (trx) => {
        let grade = 0
        await trx
          .insertInto('Answer')
          .values(
            modelQuestions.map((question) => {
              const answer = answers[question.id] || null
              const questionGrade = correctQuestion(question, answer)
              grade += questionGrade

              return {
                quizId: quiz.id,
                answer,
                grade: questionGrade,
                modelQuestionId: question.id,
              }
            })
          )
          .execute()
        const percentage = (grade / quiz.total!) * 100
        await ctx.db
          .updateTable('Quiz')
          .set({
            grade,
            percentage,
            submittedAt: new Date(),
            correctedAt: quiz.systemExamId ? null : new Date(),
          })
          .where('id', '=', input.id)
          .execute()
      })
    }),

  correct: protectedProcedure
    .input(correctQuizSchema)
    .mutation(async ({ input, ctx }) => {
      const { answers } = input
      const quiz = await ctx.db
        .selectFrom('Quiz')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst()
      if (!quiz)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار غير موجود',
        })

      let grade = Object.values(answers).reduce(
        (acc, questionGrade) => acc + questionGrade,
        0
      )

      const percentage = (grade / quiz.total) * 100

      await ctx.db.transaction().execute(async (trx) => {
        await trx
          .updateTable('Quiz')
          .set({
            correctedAt: new Date(),
            correctorId: ctx.session.user.id,
            percentage,
            grade,
          })
          .where('id', '=', input.id)
          .execute()
        for (const [id, grade] of Object.entries(answers)) {
          await trx
            .updateTable('Answer')
            .set({ grade })
            .where('id', '=', id)
            .execute()
        }
      })
      return true
    }),

  update: protectedProcedure
    .input(editQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.updateTable('Quiz').set(data).where('id', '=', id).execute()
      return true
    }),

  export: protectedProcedure
    .input(z.object({ systemExamId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const { systemExamId } = input

      const quizzes = await ctx.db
        .selectFrom('Quiz')
        .leftJoin('User as examinee', 'Quiz.examineeId', 'examinee.id')
        .leftJoin('User as corrector', 'Quiz.correctorId', 'corrector.id')
        .selectAll('Quiz')
        .select([
          'examinee.name as examineeName',
          'examinee.email as examineeEmail',
          'corrector.name as correctorName',
        ])
        .where('systemExamId', '=', systemExamId)
        .execute()

      return exportSheet(quizzes, (q) => ({
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
})
