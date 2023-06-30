import { Prisma } from '@prisma/client'
import { QuestionDifficulty, QuestionType, SettingKey } from '../constants'
import sampleSize from 'lodash.samplesize'
import shuffle from 'lodash.shuffle'
import { prisma } from '../server/db'
import { PageOptions } from '../types'
import { sendMail } from '../utils/email'
import { arDifficultyToEn } from '../utils/questions'
import { FilterSchema } from '../server/api/routers/exams'
import { User } from 'next-auth'
import { compareTwoStrings } from 'string-similarity'
import { isCorrectAnswer, normalizeText } from '~/utils/strings'

export const getPaginatedExams = async ({
  page,
  pageSize,
  filters,
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
            id: true,
          },
        },
        course: true,
        curriculum: true,
      },
      orderBy: [
        {
          submittedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
      where: {
        AND: [
          {
            difficulty: arDifficultyToEn(filters.difficulty || '') || undefined,
            grade,
          },
        ],
      },
    }),
    count: await prisma.exam.count(),
  }
}

export const getExamToSolve = async (id: string, authedUserId: string) => {
  const _select = {
    id: true,
    answer: false,
    question: {
      select: {
        text: true,
        textForFalse: true,
        textForTrue: true,
        option1: true,
        option2: true,
        option3: true,
        option4: true,
        style: true,
        type: true,
        answer: false,
      },
    },
  }
  const _exam = await prisma.exam.findFirst({ where: { id } })
  if (!_exam) return null
  if (_exam.submittedAt) _select.answer = true
  if (_exam.grade) _select.question.select.answer = true
  const select = Prisma.validator<Prisma.ExamQuestionSelect>()(_select)
  const exam = await prisma.exam.findFirst({
    where: {
      userId: authedUserId,
      id,
      // submittedAt: null
    },
    include: {
      questions: {
        select,
      },
    },
  })
  return exam
}

export const getExam = async (id: string) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id,
    },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
      user: true,
    },
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
          key: (difficulty + '_MCQ_QUESTIONS') as SettingKey,
        },
      })
    ).value
  )

  const numberOfWrittenQuestions = Number(
    (
      await prisma.setting.findFirstOrThrow({
        where: {
          key: (difficulty + '_WRITTEN_QUESTIONS') as SettingKey,
        },
      })
    ).value
  )

  const select = Prisma.validator<Prisma.QuestionSelect>()({
    id: true,
    text: true,
    textForFalse: true,
    textForTrue: true,
    option1: true,
    option2: true,
    option3: true,
    option4: true,
    style: true,
    type: true,
  })

  const mcqQuestions = await prisma.question.findMany({
    where: {
      difficulty,
      type: QuestionType.MCQ,
      courseId,
      pageNumber: { gte: range[0], lte: range[1] },
    },
    select,
  })

  const writtenQuestions = await prisma.question.findMany({
    where: {
      difficulty,
      type: QuestionType.WRITTEN,
      courseId,
      pageNumber: { gte: range[0], lte: range[1] },
    },
    select,
  })

  return {
    mcq: sampleSize(mcqQuestions, numberOfMcqQuestions),
    written: sampleSize(writtenQuestions, numberOfWrittenQuestions),
  }
}

export const createExam = async (
  difficulty: QuestionDifficulty,
  courseId: number,
  curriculumId: number,
  user: User & { role?: string }
) => {
  const curriculum = await prisma.curriculum.findFirstOrThrow({
    where: { id: curriculumId, courseId },
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
        create: questions.map((q) => ({ question: { connect: { id: q.id } } })),
      },
      user: {
        connect: {
          id: user.id,
        },
      },
      course: { connect: { id: courseId } },
      curriculum: { connect: { id: curriculumId } },
    },
  })
}

export const submitExam = async (
  id: string,
  answers: Record<string, string | null>
) => {
  const exam = await prisma.exam.findFirstOrThrow({ where: { id } })
  if (exam.submittedAt) throw new Error('تم تسليم هذا الإختبار من قبل')

  const questions = await Promise.all(
    Object.entries(answers).map(async ([id, answer]) => {
      const examQuestion = await prisma.examQuestion.findFirstOrThrow({
        where: {
          id: Number(id),
        },
        include: {
          question: true,
        },
      })

      const isCorrect = isCorrectAnswer(examQuestion.question, answer)

      return {
        where: { id: Number(id) },
        data: {
          answer,
          isCorrect,
        },
      }
    })
  )

  await prisma.exam.update({
    where: {
      id,
    },
    data: {
      submittedAt: new Date(),
      questions: {
        update: questions,
      },
    },
  })
}

export const saveExam = async (
  id: string,
  questions: Record<string, boolean>
) => {
  const _questions = Object.entries(questions).map(([id, isCorrect]) => ({
    where: { id: Number(id) },
    data: {
      isCorrect,
    },
  }))
  await prisma.exam.update({
    where: {
      id,
    },
    data: {
      grade: Object.values(questions).filter((isCorrect) => isCorrect).length,
      questions: {
        update: _questions,
      },
    },
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
          email: true,
        },
      },
    },
  })

  const brandColor = '#346df1'
  const buttonText = '#fff'

  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  }

  return sendMail({
    to: [
      {
        email: exam.user.email!,
        // email: exam.user.email
      },
    ],
    subject: 'تم تصحيح الإختبار الخاص بك',
    textContent: `الدرجة الخاصة بك هي ${exam.grade} من ${exam.questions.length}`,
    htmlContent: `<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>تم تصحيح الإختبار الخاص بك</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px; padding: 10px 20px; font-weight: bold; font-size: 20px" bgcolor="${color.buttonBackground}">${exam.grade}/${exam.questions.length}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        إذا كنت تظن أن هناك مشكلة، قم بالتواصل معنا.
      </td>
    </tr>
  </table>
</body>`,
  })
}
