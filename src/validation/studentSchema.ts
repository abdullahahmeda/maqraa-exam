import { z } from 'zod'
import { userSchema } from './userSchema'

export const studentSchema = userSchema.extend({
  phone: z.string(),
})
