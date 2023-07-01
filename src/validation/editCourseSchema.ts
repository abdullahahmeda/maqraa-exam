import { z } from 'zod'
import { newCourseSchema } from './newCourseSchema'

export const editCourseSchema = newCourseSchema.extend({
  id: z.string().min(1),
})
