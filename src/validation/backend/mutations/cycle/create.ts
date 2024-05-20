import { z } from 'zod'

export const createCycleSchema = z.object({
  name: z.string().trim().min(1),
})
