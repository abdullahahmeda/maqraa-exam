import { z } from 'zod'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import { numberInput } from '~/validation/common'
import { includeSchema } from './common'

export const listRandomQuestionsSchema = z.object({
  limit: numberInput.pipe(z.number().positive().safe()),
  filters: z.object({
    difficulty: z
      .nativeEnum(QuestionDifficulty)
      .or(z.literal('').transform(() => undefined))
      .optional(),
    type: z
      .nativeEnum(QuestionType)
      .or(z.literal('').transform(() => undefined))
      .optional(),
    isInsideShaded: z
      .boolean()
      .or(z.literal('').transform(() => undefined))
      .optional(),
    courseId: z
      .string()
      .or(z.literal('').transform(() => undefined))
      .optional(),
    curriculum: z
      .object({
        id: z.string(),
        type: z
          .nativeEnum(QuizType)
          .or(z.literal('').transform(() => undefined))
          .optional()
          .default(QuizType.WHOLE_CURRICULUM),
      })
      .optional(),
  }),
  include: includeSchema.optional(),
})
export type ListRandomQuestionsSchema = z.infer<
  typeof listRandomQuestionsSchema
>
