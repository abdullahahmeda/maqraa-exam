import { Prisma } from '@prisma/client'
import { QuestionDifficulty, QuestionType, SettingKey } from '../constants'
import sampleSize from 'lodash.samplesize'
import shuffle from 'lodash.shuffle'
import { prisma } from '../server/db'

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

const getRandomQuestionsForDifficulty = async (
  difficulty: QuestionDifficulty
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
      type: QuestionType.MCQ
    },
    select
  })

  const writtenQuestions = await prisma.question.findMany({
    where: {
      difficulty,
      type: QuestionType.WRITTEN
    },
    select
  })

  return {
    mcq: sampleSize(mcqQuestions, numberOfMcqQuestions),
    written: sampleSize(writtenQuestions, numberOfWrittenQuestions)
  }
}

export const createExam = async (difficulty: QuestionDifficulty) => {
  const _questions = await getRandomQuestionsForDifficulty(difficulty)
  const questions = shuffle(_questions.mcq.concat(_questions.written))
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
      }
    }
  })
}

export const submitExam = async (
  id: string,
  answers: Record<string, string | null>
) => {
  await prisma.exam.update({
    where: {
      id
    },
    data: {
      submittedAt: new Date(),
      questions: {
        update: Object.entries(answers).map(([id, answer]) => ({
          where: { id: Number(id) },
          data: {
            answer
          }
        }))
      }
    }
  })
}
