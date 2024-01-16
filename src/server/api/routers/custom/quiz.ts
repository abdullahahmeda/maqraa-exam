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
import { editQuizSchema } from '~/validation/editQuizSchema'
import { exportSheet } from '~/services/sheet'
import { percentage } from '~/utils/percentage'
import { formatDate } from '~/utils/formatDate'
import { DB } from '~/kysely/types'
import { SelectQueryBuilder } from 'kysely'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { correctQuestion } from '~/utils/strings'
import sampleSize from 'lodash.samplesize'
import { QuestionDifficulty } from '~/kysely/enums'
import { getQuestions } from '~/services/quiz'

const quizFilterSchema = z.object({
  systemExamId: z.string().nullable().optional(),
  examineeName: z.string().optional(),
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
  return applyFilters(query, filters, {
    examineeName: (query, examineeName) =>
      query
        .innerJoin('User', 'Quiz.examineeId', 'User.id')
        .where('User.name', 'like', `${examineeName}%`),
  })
}

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(newQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        courseId,
        repeatFromSameHadith,
        questionsNumber,
        difficulty,
        from,
        to,
      } = input

      const allEligibleQuestions = await getQuestions({
        courseId,
        fromPart: from.part,
        toPart: to.part,
        fromPage: from.page,
        toPage: to.page,
        fromHadith: from.hadith,
        toHadith: to.hadith,
        repeatFromSameHadith,
        difficulty,
      })

      console.log(allEligibleQuestions)

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
          .values({ systemExamId: null })
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
            }))
          )
          .execute()

        return await trx
          .insertInto('Quiz')
          .values({
            examineeId: ctx.session?.user.id ?? null,
            modelId,
            total,
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
            z.number().int().safe().finite()
          )
          .optional(),
        toPart: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite()
          )
          .optional(),
        fromPage: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite()
          )
          .optional(),
        toPage: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite()
          )
          .optional(),
        fromHadith: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite()
          )
          .optional(),
        toHadith: z
          .preprocess(
            (v) => (v !== '' ? Number(v) : v),
            z.number().int().safe().finite()
          )
          .optional(),
        difficulty: z
          .union([
            z.nativeEnum(QuestionDifficulty, {
              invalid_type_error: 'يجب اختيار المستوى',
            }),
            z.literal('').transform(() => null),
            z.null(),
          ])
          .optional(),
        repeatFromSameHadith: z.boolean().optional(),
      })
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
        questions = (
          await getQuestions({
            courseId: input.courseId,
            fromPart: input.fromPart,
            toPart: input.toPart,
            fromPage: input.fromPage,
            toPage: input.toPage,
            fromHadith: input.fromHadith,
            toHadith: input.toHadith,
            repeatFromSameHadith: input.repeatFromSameHadith,
            difficulty: input.difficulty,
          })
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
            .leftJoin('User as corrector', 'Quiz.correctorId', 'corrector.id')
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
          .select(({ fn }) => fn.count('Quiz.id').as('total')),
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
              // TODO: try to remove `as any` and see if there is a possibilty for errors
              const questionGrade = correctQuestion(question as any, answer)
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

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.deleteFrom('Quiz').where('id', '=', input).execute()
      return true
    }),
})
