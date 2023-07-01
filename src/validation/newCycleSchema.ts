import { z } from 'zod'

export const newCycleSchema = z.object({
  name: z.string().trim().min(1),
})
