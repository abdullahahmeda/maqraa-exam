/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CycleCourseOrderByRelationAggregateInputObjectSchema } from './CycleCourseOrderByRelationAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    courses: z
      .lazy(() => CycleCourseOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleOrderByWithRelationInputObjectSchema = Schema
