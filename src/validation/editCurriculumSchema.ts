import { z } from 'zod'
import { newCurriculumSchema } from './newCurriculumSchema'

export const editCurriculumSchema = newCurriculumSchema.extend({
  id: z.string().min(1),
})
