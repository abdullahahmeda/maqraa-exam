/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereInputObjectSchema } from './CycleCourseWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseListRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    every: z.lazy(() => CycleCourseWhereInputObjectSchema).optional(),
    some: z.lazy(() => CycleCourseWhereInputObjectSchema).optional(),
    none: z.lazy(() => CycleCourseWhereInputObjectSchema).optional(),
  })
  .strict()

export const CycleCourseListRelationFilterObjectSchema = Schema
