import { z } from 'zod'
import { QuestionsGroupType, QuizType } from '~/kysely/enums'
import { numberInput } from '~/validation/common'

const questionSchema = z.object({
  id: z.string(),
  weight: numberInput.pipe(z.number().int().safe().positive()),
})

const groupSchema = z.object({
  // type: z.nativeEnum(QuestionsGroupType),
  questions: z.array(questionSchema).min(1),
})

export const createExamSchema = z.object({
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
  // repeatFromSameHadith: z.boolean(),
  groups: z.array(groupSchema).min(1),
})
