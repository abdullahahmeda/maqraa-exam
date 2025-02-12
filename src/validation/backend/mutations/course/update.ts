import { z } from 'zod'
import { createCourseSchema } from './create'

export const updateCourseSchema = createCourseSchema.extend({
  id: z.string().min(1),
})
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>
