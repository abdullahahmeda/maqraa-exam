import { z } from 'zod'

export const getCycleSchema = z.object({
  id: z.string(),
})
