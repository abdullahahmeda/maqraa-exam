import { z } from 'zod'
import { newCycleSchema } from './newCycleSchema'

export const editCycleSchema = newCycleSchema.extend({ id: z.string().min(1) })
