import { z } from 'zod'
import { baseSchema, generateSchema } from './common'

export const updateUserSchema = generateSchema(
  baseSchema.extend({ id: z.string().min(1) }),
)
