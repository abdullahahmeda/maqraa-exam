import { z } from 'zod'
import { filtersSchema, includeSchema } from './common'

export const infiniteListQuestionSchema = z.object({
  filters: filtersSchema,
  include: includeSchema.optional(),
  cursor: z.string().optional(),
})
export type InfiniteListQuestionSchema = z.infer<typeof infiniteListQuestionSchema>
