import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema, includeSchema } from './common'

export const listTrackSchema = z.object({
  filters: filtersSchema.optional(),
  include: includeSchema.optional(),
  pagination: paginationSchema.optional(),
})
