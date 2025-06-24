import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema } from './common'

export const listCycleSchema = z.object({
  filters: filtersSchema.optional(),
  pagination: paginationSchema.optional(),
})
export type ListCycleSchema = z.infer<typeof listCycleSchema>
