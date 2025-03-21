import { z } from 'zod'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import { numberInput } from '~/validation/common'

export const includeSchema = z.record(
  z.union([z.literal('course'), z.literal('style')]),
  z.boolean().optional(),
)
export type IncludeSchema = z.infer<typeof includeSchema>

export const filtersSchema = z.object({
  id: z.string().optional(),
  number: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  partNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .or(
      z.object({
        from: numberInput.pipe(z.number().int().safe().finite()).optional(),
        to: numberInput.pipe(z.number().int().safe().finite()).optional(),
      }),
    )
    .optional(),
  pageNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .or(
      z.object({
        from: numberInput.pipe(z.number().int().safe().finite()).optional(),
        to: numberInput.pipe(z.number().int().safe().finite()).optional(),
      }),
    )
    .optional(),
  hadithNumber: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .or(
      z.object({
        from: z
          .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
          .optional(),
        to: z.preprocess(
          (v) => Number(v),
          z.number().int().safe().min(0).finite(),
        ),
      }),
    )
    .or(
      z.object({
        from: z.preprocess(
          (v) => Number(v),
          z.number().int().safe().min(0).finite(),
        ),
        to: z
          .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
          .optional(),
      }),
    )
    .optional(),
  courseId: z.string().optional(),
  text: z.string().optional(),
  curriculum: z
    .object({
      id: z.string(),
      type: z.nativeEnum(QuizType),
    })
    .optional(),
  type: z.nativeEnum(QuestionType).optional(),
  styleId: z.string().optional(),
  isInsideShaded: z.boolean().optional(),
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>
