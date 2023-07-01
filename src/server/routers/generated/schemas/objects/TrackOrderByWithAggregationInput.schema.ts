/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { TrackCountOrderByAggregateInputObjectSchema } from './TrackCountOrderByAggregateInput.schema'
import { TrackMaxOrderByAggregateInputObjectSchema } from './TrackMaxOrderByAggregateInput.schema'
import { TrackMinOrderByAggregateInputObjectSchema } from './TrackMinOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => TrackCountOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z.lazy(() => TrackMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => TrackMinOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const TrackOrderByWithAggregationInputObjectSchema = Schema
