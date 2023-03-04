import { QuestionDifficulty } from '../constants'
import { z } from 'zod'

export const newExamSchema = z.object({
  difficulty: z.nativeEnum(QuestionDifficulty)
})
