import { z } from 'zod'
import { includeSchema } from './common'

export const getQuizSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
