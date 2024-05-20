import { z } from 'zod'
import { baseSchema, generateSchema } from './common'

export const updateQuestionStyleSchema = generateSchema(
  baseSchema.extend({
    id: z.string(),
  }),
)
