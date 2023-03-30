import { Prisma } from '@prisma/client'
import { QuestionDifficulty, QuestionType, SettingKey } from '../constants'
import sampleSize from 'lodash.samplesize'
import shuffle from 'lodash.shuffle'
import { prisma } from '../server/db'
import { PageOptions } from '../types'
import { sendMail } from '../utils/email'
import { arDifficultyToEn } from '../utils/questions'
import { FilterSchema } from '../server/api/routers/exams'

export const getPaginatedExams = async ({
  page,
  pageSize,
  filters
}: PageOptions & {
  filters: Required<FilterSchema>
}) => {
  filters = filters!
  let grade
  if (filters.graded === 'no') grade = null
  else if (filters.graded === 'yes')
    grade = filters.grade === '' ? { not: null } : filters.grade
  else grade = filters.grade === '' ? undefined : filters.grade
  // console.log(filters)
  return {
    exams: await prisma.exam.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: true,
        questions: {
          select: {
            id: true
          }
        },
        course: true,
        curriculum: true
      },
      orderBy: [
        {
          submittedAt: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      where: {
        AND: [
          {
            difficulty: arDifficultyToEn(filters.difficulty || '') || undefined,
            grade
          }
        ]
      }
    }),
    count: await prisma.exam.count()
  }
}

export const getExamToSolve = async (id: string) => {
  const exam = await prisma.exam.findFirst({
    where: {
      // userId: authedUser,
      id,
      submittedAt: null
    },
    include: {
      questions: {
        select: {
          id: true,
          question: {
            select: {
              text: true,
              falseText: true,
              trueText: true,
              option1: true,
              option2: true,
              option3: true,
              option4: true,
              style: true,
              type: true
            }
          }
        }
      }
    }
  })
  return exam
}

export const getExam = async (id: string) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id
    },
    include: {
      questions: {
        include: {
          question: true
        }
      },
      user: true
    }
  })
  return exam
}

const getRandomQuestionsForDifficulty = async (
  difficulty: QuestionDifficulty,
  courseId: number,
  range: [x1: number, x2: number]
) => {
  const numberOfMcqQuestions = Number(
    (
      await prisma.setting.findFirstOrThrow({
        where: {
          key: (difficulty + '_MCQ_QUESTIONS') as SettingKey
        }
      })
    ).value
  )

  const numberOfWrittenQuestions = Number(
    (
      await prisma.setting.findFirstOrThrow({
        where: {
          key: (difficulty + '_WRITTEN_QUESTIONS') as SettingKey
        }
      })
    ).value
  )

  const select = Prisma.validator<Prisma.QuestionSelect>()({
    id: true,
    text: true,
    falseText: true,
    trueText: true,
    option1: true,
    option2: true,
    option3: true,
    option4: true,
    style: true,
    type: true
  })

  const mcqQuestions = await prisma.question.findMany({
    where: {
      difficulty,
      type: QuestionType.MCQ,
      courseId,
      pageNumber: { gte: range[0], lte: range[1] }
    },
    select
  })

  const writtenQuestions = await prisma.question.findMany({
    where: {
      difficulty,
      type: QuestionType.WRITTEN,
      courseId,
      pageNumber: { gte: range[0], lte: range[1] }
    },
    select
  })

  return {
    mcq: sampleSize(mcqQuestions, numberOfMcqQuestions),
    written: sampleSize(writtenQuestions, numberOfWrittenQuestions)
  }
}

export const createExam = async (
  difficulty: QuestionDifficulty,
  courseId: number,
  curriculumId: number
) => {
  const curriculum = await prisma.curriculum.findFirstOrThrow({
    where: { id: curriculumId, courseId }
  })
  const _questions = await getRandomQuestionsForDifficulty(
    difficulty,
    courseId,
    [curriculum.fromPage, curriculum.toPage]
  )
  const questions = shuffle(_questions.mcq.concat(_questions.written))

  if (questions.length === 0) throw new Error('لا يوجد أسئلة')

  return await prisma.exam.create({
    data: {
      difficulty,
      questions: {
        create: questions.map(q => ({ question: { connect: { id: q.id } } }))
      },
      user: {
        connectOrCreate: {
          where: { id: 'testuser' },
          create: {
            id: 'testuser',
            name: 'Test User',
            email: 'testuser@test.com'
          }
        }
      },
      course: { connect: { id: courseId } },
      curriculum: { connect: { id: curriculumId } }
    }
  })
}

export const submitExam = async (
  id: string,
  answers: Record<string, string | null>
) => {
  const questions = await Promise.all(
    Object.entries(answers).map(async ([id, answer]) => {
      const examQuestion = await prisma.examQuestion.findFirst({
        where: {
          id: Number(id)
        },
        include: {
          question: true
        }
      })

      const isCorrect = examQuestion?.question.answer === answer
      return {
        where: { id: Number(id) },
        data: {
          answer,
          isCorrect
        }
      }
    })
  )

  await prisma.exam.update({
    where: {
      id
    },
    data: {
      submittedAt: new Date(),
      questions: {
        update: questions
      }
    }
  })
}

export const saveExam = async (
  id: string,
  questions: Record<string, boolean>
) => {
  const _questions = Object.entries(questions).map(([id, isCorrect]) => ({
    where: { id: Number(id) },
    data: {
      isCorrect
    }
  }))
  await prisma.exam.update({
    where: {
      id
    },
    data: {
      grade: Object.values(questions).filter(isCorrect => isCorrect).length,
      questions: {
        update: _questions
      }
    }
  })
}

export const deleteExam = (id: string) => prisma.exam.delete({ where: { id } })

export const sendGradeEmail = async (examId: string) => {
  const exam = await prisma.exam.findFirstOrThrow({
    where: { id: examId },
    select: {
      grade: true,
      questions: true,
      user: {
        select: {
          email: true
        }
      }
    }
  })
  return sendMail({
    to: [
      {
        email: 'elmagicabdulah@gmail.com'
        // email: exam.user.email
      }
    ],
    subject: 'تم تصحيح الاختبار الخاص بك',
    textContent: `الدرجة الخاصة بك هي ${exam.grade} من ${exam.questions.length}`
  })
}
