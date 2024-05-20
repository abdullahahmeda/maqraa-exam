import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema } from './common'

export const listQuestionStyleSchema = z.object({
  pagination: paginationSchema.optional(),
  filters: filtersSchema.optional(),
})
