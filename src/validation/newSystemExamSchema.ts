import { QuizType, QuestionsGroupType } from '~/kysely/enums'
import { z } from 'zod'
import { numberInput } from './common'

const questionSchema = z.object({
  id: z.string(),
  grade: numberInput.pipe(z.number().int().safe().positive()),
})

const groupSchema = z.object({
  type: z.nativeEnum(QuestionsGroupType),
  questions: z.record(z.string(), z.object({ id: z.string() })),
})

export const newSystemExamSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(QuizType),
  isInsideShaded: z
    .boolean()
    .or(z.literal('INSIDE').transform(() => true))
    .or(z.literal('OUTSIDE').transform(() => false))
    .or(z.literal('').transform(() => undefined))
    .optional(),
  endsAt: z.date().nullish(),
  courseId: z.string(),
  trackId: z.string(),
  curriculumId: z.string(),
  cycleId: z.string(),
  repeatFromSameHadith: z.boolean(),
  groups: z
    .array(groupSchema)
    .min(1)
    .refine(
      (groups) =>
        groups.every((group) => {
          const questionsCount = Object.keys(group.questions).length
          return questionsCount > 0
        }),
      {
        message: 'هناك مجموعات لا تحتوي على أي أسئلة',
      },
    ),
  questions: z.array(z.record(z.string(), questionSchema)).min(1),
})
