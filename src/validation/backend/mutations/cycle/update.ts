import { z } from 'zod'
import { createCycleBackendSchema } from './create'

export const updateCycleBackendSchema = createCycleBackendSchema.extend({
  id: z.string().min(1),
})

export type UpdateCycleBackendSchema = z.infer<typeof updateCycleBackendSchema>
