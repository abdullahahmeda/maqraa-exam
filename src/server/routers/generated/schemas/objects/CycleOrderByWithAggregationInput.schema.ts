/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CycleCountOrderByAggregateInputObjectSchema } from './CycleCountOrderByAggregateInput.schema'
import { CycleMaxOrderByAggregateInputObjectSchema } from './CycleMaxOrderByAggregateInput.schema'
import { CycleMinOrderByAggregateInputObjectSchema } from './CycleMinOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => CycleCountOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z.lazy(() => CycleMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => CycleMinOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const CycleOrderByWithAggregationInputObjectSchema = Schema
