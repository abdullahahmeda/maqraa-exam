import { z } from 'zod'
import { createCurriculumSchema } from './create'

export const updateCurriculumSchema = createCurriculumSchema.extend({
  id: z.string().min(1),
})
export type UpdateCurriculumSchema = z.infer<typeof updateCurriculumSchema>
