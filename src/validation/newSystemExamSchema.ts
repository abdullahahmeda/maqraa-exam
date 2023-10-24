import { QuizType, QuestionStyle, QuestionType } from '@prisma/client'
import { QuestionDifficulty } from '../constants'
import { z } from 'zod'
import { groupSchema } from './newQuizSchema'

export const newSystemExamSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(QuizType),
  endsAt: z.date().nullish(),
  courseId: z.string().min(1),
  trackId: z.string().min(1),
  curriculumId: z.string().min(1),
  cycleId: z.string().min(1),
  repeatFromSameHadith: z.boolean(),
  groups: z.array(groupSchema).superRefine((groups, ctx) => {
    // let numberSum = 0
    let gradeSum = 0
    groups.forEach((group) => {
      // numberSum += group.questionsNumber
      gradeSum += group.questionsNumber * group.gradePerQuestion
    })
    if (gradeSum > 100)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'الدرجة الكلية يجب ألا تزيد عن 100',
      })
  }),
})
