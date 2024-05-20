import { z } from 'zod'
import { filtersSchema, includeSchema } from './common'
import { paginationSchema } from '~/validation/pagination'

export const listExamsSchema = z.object({
  filters: filtersSchema.optional(),
  include: includeSchema.optional(),
  pagination: paginationSchema.optional(),
})
