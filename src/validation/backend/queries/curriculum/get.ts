import { z } from 'zod'
import { includeSchema } from './common'

export const getCurriculumSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
