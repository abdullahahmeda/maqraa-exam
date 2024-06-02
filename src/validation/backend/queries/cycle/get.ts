import { z } from 'zod'
import { includeSchema } from './common'

export const getCycleSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
