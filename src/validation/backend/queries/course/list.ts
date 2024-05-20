import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema } from './common'

export const listCourseSchema = z.object({
  filters: filtersSchema.optional(),
  pagination: paginationSchema.optional(),
})
