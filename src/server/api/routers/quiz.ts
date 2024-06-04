import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { editQuizSchema } from '~/validation/editQuizSchema'
import { exportSheet } from '~/services/sheet'
import { percentage } from '~/utils/percentage'
import { formatDate } from '~/utils/formatDate'
import type { DB, Quiz } from '~/kysely/types'
import {
  type Expression,
  type ExpressionBuilder,
  type SqlBool,
  type Selectable,
  sql,
} from 'kysely'
import { applyPagination } from '~/utils/db'
import { correctQuestion } from '~/utils/strings'
import sampleSize from 'lodash.samplesize'
import { QuestionDifficulty, QuestionType, UserRole } from '~/kysely/enums'
import { db } from '~/server/db'
import { createQuizSchema } from '~/validation/backend/mutations/quiz/create'
import { listQuizSchema } from '~/validation/backend/queries/quiz/list'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/quiz/common'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { submitQuizSchema } from '~/validation/backend/mutations/quiz/submit'
import { getQuizSchema } from '~/validation/backend/queries/quiz/get'
import { applyQuestionsFilters } from '~/services/question'
import { whereCanReadQuiz } from '~/services/quiz'

async function canUserRead(
  user: { role: UserRole; id: string },
  quiz: Selectable<Quiz>,
) {
  if (user.role === 'ADMIN') return true
  if (quiz.examineeId === user.id) return true
  if (quiz.systemExamId) {
    const systemExam = await db
      .selectFrom('SystemExam')
      .selectAll('SystemExam')
      .where('id', '=', quiz.systemExamId)
      .executeTakeFirstOrThrow()

    const userCycles = await db
      .selectFrom('UserCycle')
      .selectAll('UserCycle')
      .where('userId', '=', user.id)
      .execute()

    return userCycles.some(
      (c) =>
        c.curriculumId === systemExam.curriculumId &&
        c.cycleId === systemExam.cycleId,
    )
  }

  return false
}

function applyInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Quiz'>) => {
    return [
      ...(include?.curriculum
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Curriculum')
                .selectAll('Curriculum')
                .whereRef('Quiz.curriculumId', '=', 'Curriculum.id'),
            ).as('curriculum'),
          ]
        : []),

      ...(include?.model
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Model')
                .selectAll('Model')
                .whereRef('Quiz.modelId', '=', 'Model.id'),
            ).as('model'),
          ]
        : []),

      ...(include?.corrector
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('User')
                .selectAll('User')
                .whereRef('Quiz.correctorId', '=', 'User.id'),
            ).as('corrector'),
          ]
        : []),

      ...(include?.examinee
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('User')
                .selectAll('User')
                .whereRef('Quiz.examineeId', '=', 'User.id'),
            ).as('examinee'),
          ]
        : []),

      ...(include?.systemExam
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('SystemExam')
                .selectAll('SystemExam')
                .whereRef('Quiz.systemExamId', '=', 'SystemExam.id'),
            ).as('systemExam'),
          ]
        : []),
    ]
  }
}

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Quiz'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.systemExamId !== undefined) {
      if (filters.systemExamId === null)
        where.push(eb('Quiz.systemExamId', 'is', null))
      else if (filters.systemExamId === 'not_null')
        where.push(eb('Quiz.systemExamId', 'is not', null))
      else where.push(eb('Quiz.systemExamId', '=', filters.systemExamId))
    }
    if (filters?.examinee?.name)
      where.push(
        eb.exists(
          eb
            .selectFrom('User')
            .where('User.name', 'like', `%${filters.examinee.name}%`)
            .whereRef('Quiz.examineeId', '=', 'User.id'),
        ),
      )
    return eb.and(where)
  }
}

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        courseId,
        repeatFromSameHadith,
        questionsNumber,
        difficulty,
        from,
        to,
      } = input

      const where = await applyQuestionsFilters({
        courseId,
        partNumber: { from: from.part, to: to.part },
        pageNumber: { from: from.page, to: to.page },
        hadithNumber: { from: from.hadith, to: to.hadith },
        difficulty,
        // repeatFromSameHadith,
      })
      const allEligibleQuestions = await ctx.db
        .selectFrom('Question')
        .selectAll('Question')
        .where(where)
        .execute()

      const questions = sampleSize(allEligibleQuestions, questionsNumber)

      if (questions.length < questionsNumber)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `أقصى عدد مسموح به للأسئلة ${questions.length}`,
        })

      const total = questionsNumber

      const quiz = await ctx.db.transaction().execute(async (trx) => {
        const { id: modelId } = await trx
          .insertInto('Model')
          .values({ total })
          .returning('id')
          .executeTakeFirstOrThrow()
        await trx
          .insertInto('ModelQuestion')
          .values(
            questions.map((q, i) => ({
              modelId,
              order: i + 1,
              questionId: q.id,
              weight: 1,
            })),
          )
          .execute()

        return await trx
          .insertInto('Quiz')
          .values({
            examineeId: ctx.session?.user.id ?? null,
            modelId,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
      })
      return quiz
    }),

  getQuestionsInfo: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
        fromPart: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        toPart: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        fromPage: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        toPage: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        fromHadith: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        toHadith: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite(),
          )
          .optional(),
        difficulty: z
          .union([
            z.nativeEnum(QuestionDifficulty, {
              invalid_type_error: 'يجب اختيار المستوى',
            }),
            z.literal('all').transform(() => undefined),
          ])
          .optional(),
        repeatFromSameHadith: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const parts = (
        await ctx.db
          .selectFrom('Question')
          .select('partNumber')
          .distinct()
          .where('courseId', '=', input.courseId)
          .orderBy('partNumber')
          .execute()
      ).map(({ partNumber }) => partNumber)

      let fromPages: number[] | undefined = undefined
      let fromHadiths: number[] | undefined = undefined
      if (input.fromPart) {
        fromPages = (
          await ctx.db
            .selectFrom('Question')
            .select('pageNumber')
            .distinct()
            .where('courseId', '=', input.courseId)
            .where('partNumber', '=', input.fromPart)
            .orderBy('pageNumber')
            .execute()
        ).map(({ pageNumber }) => pageNumber)
        if (input.fromPage)
          fromHadiths = (
            await ctx.db
              .selectFrom('Question')
              .select('hadithNumber')
              .distinct()
              .where('courseId', '=', input.courseId)
              .where('partNumber', '=', input.fromPart)
              .where('pageNumber', '=', input.fromPage)
              .orderBy('hadithNumber')
              .execute()
          ).map(({ hadithNumber }) => hadithNumber)
      }

      let toPages: number[] | undefined = undefined
      let toHadiths: number[] | undefined = undefined
      if (input.toPart) {
        toPages = (
          await ctx.db
            .selectFrom('Question')
            .select('pageNumber')
            .distinct()
            .where('courseId', '=', input.courseId)
            .where('partNumber', '=', input.toPart)
            .orderBy('pageNumber')
            .execute()
        ).map(({ pageNumber }) => pageNumber)

        if (input.toPage)
          toHadiths = (
            await ctx.db
              .selectFrom('Question')
              .select('hadithNumber')
              .distinct()
              .where('courseId', '=', input.courseId)
              .where('partNumber', '=', input.toPart)
              .where('pageNumber', '=', input.toPage)
              .orderBy('hadithNumber')
              .execute()
          ).map(({ hadithNumber }) => hadithNumber)
      }

      let questions: number | undefined = undefined
      if (
        input.courseId &&
        input.fromPart &&
        input.fromPage &&
        input.fromHadith &&
        input.toPart &&
        input.toPage &&
        input.toHadith
      ) {
        const where = await applyQuestionsFilters({
          courseId: input.courseId,
          partNumber: { from: input.fromPart, to: input.toPart },
          pageNumber: { from: input.fromPage, to: input.toPage },
          hadithNumber: { from: input.fromHadith, to: input.toHadith },
          difficulty: input.difficulty,
          // repeatFromSameHadith,
        })
        questions = (
          await ctx.db
            .selectFrom('Question')
            .selectAll('Question')
            .where(where)
            .execute()
        ).length
      }

      return {
        parts,
        fromPages,
        toPages,
        fromHadiths,
        toHadiths,
        questions,
      }
    }),

  get: protectedProcedure.input(getQuizSchema).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .selectFrom('Quiz')
      .selectAll('Quiz')
      .where('id', '=', input.id)
      .select(applyInclude(input?.include))
      .executeTakeFirst()

    const isAbleToRead = await canUserRead(
      ctx.session.user,
      result as Selectable<Quiz>,
    )
    return isAbleToRead ? result : null
  }),

  list: protectedProcedure
    .input(listQuizSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Quiz')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .where(whereCanReadQuiz(ctx.session))
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('Quiz')
          .selectAll()
          .where(where)
          .where(whereCanReadQuiz(ctx.session))
          .select(applyInclude(input?.include)),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  submit: publicProcedure
    .input(submitQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const { answers } = input
      const quiz = await ctx.db
        .selectFrom('Quiz')
        .selectAll('Quiz')
        .leftJoin('Model', 'Quiz.modelId', 'Model.id')
        .select(['Model.total as total'])
        .where('Quiz.id', '=', input.id)
        .$narrowType<{ total: number }>()
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
          'ModelQuestion.modelId',
          'Question.answer',
          'Question.type',
        ])
        .where('ModelQuestion.modelId', '=', quiz.modelId)
        .$narrowType<{ type: QuestionType; answer: string }>()
        .execute()

      await ctx.db.transaction().execute(async (trx) => {
        let grade = 0
        await trx
          .insertInto('Answer')
          .values(
            modelQuestions.map((question) => {
              const answer = answers[question.id] ?? null
              const questionGrade = correctQuestion(question, answer)
              grade += questionGrade

              return {
                quizId: quiz.id,
                answer,
                grade: questionGrade,
                modelQuestionId: question.id,
              }
            }),
          )
          .execute()
        const percentage = (grade / quiz.total) * 100
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
        .selectAll('Quiz')
        .leftJoin('Model', 'Quiz.modelId', 'Model.id')
        .select(['Model.total as total'])
        .where('Quiz.id', '=', input.id)
        .$narrowType<{ total: number }>()
        .executeTakeFirst()
      if (!quiz)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'هذا الاختبار غير موجود',
        })

      const grade = Object.values(answers).reduce(
        (acc, questionGrade) => acc + questionGrade,
        0,
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
        .leftJoin('Model', 'Quiz.modelId', 'Model.id')
        .selectAll('Quiz')
        .select([
          'Model.total as total',
          'examinee.name as examineeName',
          'examinee.email as examineeEmail',
          'corrector.name as correctorName',
        ])
        .where('systemExamId', '=', systemExamId)
        .$narrowType<{ total: number }>()
        .execute()

      return exportSheet(quizzes, (q) => ({
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
    .mutation(async ({ input, ctx }) => {
      await ctx.db.deleteFrom('Quiz').where('id', '=', input).execute()
      return true
    }),
})
