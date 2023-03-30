import { QuestionDifficulty } from '../constants'
import { z } from 'zod'

export const newExamSchema = z.object({
  difficulty: z.nativeEnum(QuestionDifficulty),
  course: z.number().positive().int(),
  curriculum: z.number().positive().int()
})
