import { z } from 'zod'
import { userSchema } from './userSchema'

export const studentSchema = userSchema.extend({
  name: z.string(),
  phone: z.string(),
  courseName: z.string().transform((v) => v.trim()),
  trackName: z.string().transform((v) => v.trim()),
  curriculumName: z.string().transform((v) => v.trim()),
  email: z.string().transform((v) => v.trim()),
})
