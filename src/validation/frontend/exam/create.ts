import { z } from 'zod'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import { numberInput } from '~/validation/common'

const questionSchema = z.object({
  id: z.string(),
  weight: numberInput.pipe(z.number().int().safe().positive()),
})

const groupSchema = z.object({
  questions: z.array(questionSchema).min(1),
})

const commonSchema = z.object({
  cycleId: z.string(),
  endsAt: z.date().nullish(),
  type: z.nativeEnum(QuizType),
})

export const createExamSchema = z.discriminatedUnion('curriculumSelection', [
  commonSchema.extend({
    curriculumSelection: z.literal('specific'),
    name: z.string().min(1),
    isInsideShaded: z
      .boolean()
      .or(z.literal('INSIDE').transform(() => true))
      .or(z.literal('OUTSIDE').transform(() => false))
      .or(z.literal('').transform(() => undefined))
      .optional(),
    courseId: z.string(),
    trackId: z.string(),
    curriculumId: z.string(),
    // repeatFromSameHadith: z.boolean(),
    groups: z.array(groupSchema).min(1),
  }),
  commonSchema.extend({
    curriculumSelection: z.literal('all'),
    questionsPerExam: numberInput.pipe(z.number().int().safe().positive()),
    gradePerQuestion: numberInput.pipe(z.number().int().safe().positive()),
    difficulty: z
      .nativeEnum(QuestionDifficulty)
      .or(z.literal('all').transform(() => undefined))
      .optional(),
    questionsType: z
      .nativeEnum(QuestionType)
      .or(z.literal('all').transform(() => undefined))
      .optional(),
  }),
])
