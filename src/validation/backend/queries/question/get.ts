import { z } from 'zod'
import { includeSchema } from './common'

export const getQuestionSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
