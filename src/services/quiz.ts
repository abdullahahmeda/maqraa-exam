import { z } from 'zod'
import type { PrismaClient, QuizType } from '@prisma/client'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { QuizGroupSchema, newQuizSchema } from '~/validation/newQuizSchema'
import { CurriculumService } from './curriculum'
import sampleSize from 'lodash.samplesize'
import { submitExamSchema } from '~/validation/submitExamSchema'
import { checkMutate, checkRead } from '~/server/api/routers/custom/helper'
import { TRPCError } from '@trpc/server'
import { correctQuestion } from '~/utils/strings'
import { editQuizSchema } from '~/validation/editQuizSchema'

export class QuizService {
  private db

  public constructor(db: PrismaClient) {
    this.db = db
  }

  public async create(input: any) {
    const { groups, courseId, trackId, ...data } = newQuizSchema
      .extend({ examineeId: z.string().nullish() })
      .parse(input)

    await this.validateSufficientQeustionsInGroups({
      type: 'WHOLE_CURRICULUM',
      groups,
      curriculumId: data.curriculumId,
      repeatFromSameHadith: data.repeatFromSameHadith,
    })

    const total = groups.reduce(
      (acc, g) => acc + g.gradePerQuestion * g.questionsNumber,
      0
    )

    return this.db.quiz.create({
      data: {
        ...data,
        total,
        groups: { create: groups.map((g, i) => ({ ...g, order: i + 1 })) },
      },
    })
  }

  public async submit(input: any) {
    const data = submitExamSchema
      .extend({ examineeId: z.string().nullish() })
      .parse(input)
    const { id, questions: userAnswers, examineeId } = data

    const quiz = await checkRead(
      this.db.quiz.findFirstOrThrow({ where: { id } })
    )

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

    if (examineeId != quiz.examineeId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'ليس لديك الصلاحيات لهذه العملية',
      })

    const examQuestions = await checkRead(
      this.db.quizQuestion.findMany({
        where: { quizId: id },
        include: { question: true },
      })
    )

    let grade = 0
    const questionsUpdates: Promise<any>[] = []
    for (const examQuestion of examQuestions) {
      const userAnswer = userAnswers[examQuestion.id] || null
      const questionGrade = correctQuestion(
        { ...examQuestion.question, weight: examQuestion.weight },
        userAnswer
      )
      grade += questionGrade
      questionsUpdates.push(
        this.db.quizQuestion.update({
          where: { id: examQuestion.id },
          data: { answer: userAnswer, grade: questionGrade },
        })
      )
    }

    const percentage = (grade / quiz.total!) * 100

    return this.db.$transaction(async (tx) => {
      await Promise.all(questionsUpdates)
      return await checkMutate(
        tx.quiz.update({
          where: { id },
          data: {
            ...(quiz.systemExamId ? {} : { correctedAt: new Date() }),
            grade,
            percentage,
            submittedAt: new Date(),
          },
        })
      )
    })
  }

  public async correct(input: any) {
    const { id, correctorId, questions } = correctQuizSchema
      .extend({ correctorId: z.string().min(1) })
      .parse(input)

    const quiz = await checkRead(
      this.db.quiz.findFirstOrThrow({ where: { id } })
    )

    if (!quiz)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'هذا الاختبار غير موجود',
      })

    let grade = Object.values(questions).reduce(
      (acc, questionGrade) => acc + questionGrade,
      0
    )

    // TODO: validate that `grade` is in range [0, weight]
    const percentage = (grade / quiz.total!) * 100

    return await this.db.quiz.update({
      where: { id },
      data: {
        correctedAt: new Date(),
        correctorId,
        grade,
        percentage,
        questions: {
          update: Object.entries(questions).map(([id, grade]) => ({
            where: { id },
            data: { grade },
          })),
        },
      },
    })
  }

  public async validateSufficientQeustionsInGroups({
    type,
    groups,
    curriculumId,
    repeatFromSameHadith,
  }: {
    type: QuizType
    groups: QuizGroupSchema[]
    curriculumId: string
    repeatFromSameHadith: boolean
  }) {
    const parts = await this.db.curriculumPart.findMany({
      where: { curriculumId },
      select: { from: true, mid: true, to: true, number: true },
    })

    const usedQuestions: string[] = []
    const usedHadiths: { [partNumber: number]: number[] } = {}
    for (const [groupIndex, group] of groups.entries()) {
      const styleQuery =
        group.styleOrType === 'MCQ' || group.styleOrType === 'WRITTEN'
          ? { type: group.styleOrType || undefined }
          : { style: group.styleOrType || undefined }

      const groupQuestions = await this.db.question.findMany({
        where: {
          AND: [
            {
              course: {
                tracks: {
                  some: { curricula: { some: { id: curriculumId } } },
                },
              },
            },
            { id: { notIn: usedQuestions } },
            { difficulty: group.difficulty || undefined },
            styleQuery,
            {
              OR: parts.map((part) => {
                // WHOLE_CURRICULUM
                let range = {
                  gte: part.from,
                  lte: part.to,
                }
                if (type === 'FIRST_MEHWARY')
                  range = { gte: part.from, lte: part.mid }
                else if (type === 'SECOND_MEHWARY')
                  range = { gte: Math.max(part.from, part.mid), lte: part.to }
                return {
                  partNumber: part.number,
                  hadithNumber: {
                    ...range,
                    notIn: repeatFromSameHadith ? [] : usedHadiths[part.number],
                  },
                }
              }),
            },
          ],
        },
        ...(repeatFromSameHadith ? {} : { distinct: ['hadithNumber'] }),
        take: group.questionsNumber,
        // select: { id: true, hadithNumber: true, partNumber: true, difficulty: true },
      })

      if (groupQuestions.length < group.questionsNumber) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.too_big,
            maximum: groupQuestions.length,
            inclusive: true,
            type: 'number',
            message: `أقصى عدد مسموح للأسئلة في المجموعة ${groupIndex + 1} هو ${
              groupQuestions.length
            }`,
            path: ['groups', groupIndex, 'questionsNumber'],
          },
        ])
      }

      for (const question of groupQuestions) {
        if (!repeatFromSameHadith) {
          if (usedHadiths[question.partNumber] === undefined)
            usedHadiths[question.partNumber] = [question.hadithNumber]
          else usedHadiths[question.partNumber]!.push(question.hadithNumber)
        }
        usedQuestions.push(question.id)
      }
    }
  }

  public async getQuestionsForGroups({
    groups,
    curriculumId,
    repeatFromSameHadith,
  }: {
    groups: QuizGroupSchema[]
    curriculumId: string
    repeatFromSameHadith: boolean
  }) {
    // TODO: questions order is not the same as in groups.order (so the question from last group may come first)
    const curriculumService = new CurriculumService(this.db)
    const allCurriculumQuestions = await curriculumService.getAllQuestions(
      curriculumId
    )

    // console.log('curriculum questions:', allCurriculumQuestions.length)
    // console.log('groups', groups)

    let usedQuestions = new Set()
    const usedHadiths: { [partNumber: number]: Set<number> } = {}

    let questions: { id: string; weight: number; order: number }[] = []
    let iota = 1
    for (const {
      difficulty,
      gradePerQuestion,
      questionsNumber,
      styleOrType,
    } of groups) {
      const possibleQuestions = allCurriculumQuestions.filter((q) => {
        const conditions: boolean[] = []
        conditions.push(!usedQuestions.has(q.id)) // Question is not repeated
        if (difficulty) conditions.push(q.difficulty === difficulty)

        if (styleOrType === 'MCQ' || styleOrType === 'WRITTEN')
          conditions.push(q.type === styleOrType)
        else if (styleOrType) conditions.push(q.style === styleOrType)

        if (!repeatFromSameHadith)
          conditions.push(
            usedHadiths[q.partNumber] !== undefined &&
              !usedHadiths[q.partNumber]!.has(q.hadithNumber)
          ) // Don't repeat from same hadith
        const a = conditions.every((condition) => condition === true)
        // console.log('questionn taken:', a)
        return a
      })

      const chosenGroupQuestions = sampleSize(
        possibleQuestions,
        questionsNumber
      ).map((q) => ({ ...q, order: iota++, weight: gradePerQuestion }))
      for (const question of chosenGroupQuestions) {
        if (!repeatFromSameHadith) {
          if (usedHadiths[question.partNumber] === undefined)
            usedHadiths[question.partNumber] = new Set([question.hadithNumber])
          else usedHadiths[question.partNumber]!.add(question.hadithNumber)
        }
        usedQuestions.add(question.id)
      }
      questions = questions.concat(chosenGroupQuestions)
    }
    return questions
  }

  public async update(input: any) {
    const { id, ...data } = editQuizSchema.parse(input)
    return await checkMutate(this.db.quiz.update({ where: { id }, data }))
  }
}
