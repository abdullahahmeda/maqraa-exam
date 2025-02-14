import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { filtersSchema, includeSchema } from './common'

export const listCurriculumSchema = z.object({
  filters: filtersSchema.optional(),
  include: includeSchema.optional(),
  pagination: paginationSchema.optional(),
})
export type ListCurriculumSchema = z.infer<typeof listCurriculumSchema>
