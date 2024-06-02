import { z } from 'zod'

export const createCycleFrontendSchema = z.object({
  name: z.string().trim().min(1),
  curricula: z.array(z.object({ value: z.string() })).min(1),
})

export type CreateCycleFrontendSchema = z.infer<
  typeof createCycleFrontendSchema
>
