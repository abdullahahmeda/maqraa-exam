import { z } from 'zod'
import { newUserSchema } from './newUserSchema'

export const updateUserSchema = newUserSchema.extend({ id: z.string().min(1) })
