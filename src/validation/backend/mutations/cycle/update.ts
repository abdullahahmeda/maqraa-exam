import { z } from 'zod'
import { createCycleSchema } from './create'

export const updateCycleSchema = createCycleSchema.extend({
  id: z.string().min(1),
})
