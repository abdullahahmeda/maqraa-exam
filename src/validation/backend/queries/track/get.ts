import { z } from 'zod'
import { includeSchema } from './common'

export const getTrackSchema = z.object({
  id: z.string(),
  include: includeSchema.optional(),
})
