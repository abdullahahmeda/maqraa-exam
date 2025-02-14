import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema, includeSchema } from './common'

export const listTrackSchema = z.object({
  filters: filtersSchema.optional(),
  include: includeSchema.optional(),
  pagination: paginationSchema.optional(),
})
export type ListTrackSchema = z.infer<typeof listTrackSchema>
