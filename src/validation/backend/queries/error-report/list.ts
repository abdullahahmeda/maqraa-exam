import { z } from 'zod'
import { paginationSchema } from '~/validation/pagination'
import { includeSchema } from './common'

export const listErrorReportsSchema = z.object({
  include: includeSchema.optional(),
  pagination: paginationSchema.optional(),
})
