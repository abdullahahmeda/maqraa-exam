import { z } from 'zod'
import { QuestionType, QuestionDifficulty } from '~/kysely/enums'

export const createQuestionSchema = z.object({
  number: z.preprocess((v) => Number(v), z.number().positive().int()),
  pageNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
  partNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
  hadithNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
  type: z.nativeEnum(QuestionType),
  styleId: z.string(),
  difficulty: z.nativeEnum(QuestionDifficulty),
  text: z
    .string()
    .min(1)
    .trim(),
  textForTrue: z.string().trim(),
  textForFalse: z.string().trim(),
  option1: z.string().trim(),
  option2: z.string().trim(),
  option3: z.string().trim(),
  option4: z.string().trim(),
  answer: z.string().trim(),
  anotherAnswer: z.string().min(1),
  isInsideShaded: z.boolean(),
  objective: z.string().trim(),
  courseId: z.string().min(1),
})
export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>
