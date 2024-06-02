import { z } from 'zod'
import { createCycleFrontendSchema } from './create'

export const updateCycleFrontendSchema = createCycleFrontendSchema.extend({
  id: z.string(),
})

export type UpdateCycleFrontendSchema = z.infer<
  typeof updateCycleFrontendSchema
>
