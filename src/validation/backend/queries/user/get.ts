import { z } from 'zod'
import { includeSchema } from './common'

export const getUserSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
