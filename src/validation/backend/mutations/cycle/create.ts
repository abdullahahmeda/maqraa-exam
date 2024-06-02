import { z } from 'zod'

export const createCycleBackendSchema = z.object({
  name: z.string().trim().min(1),
  curricula: z.array(z.string()).min(1),
})

export type CreateCycleBackendSchema = z.infer<typeof createCycleBackendSchema>
