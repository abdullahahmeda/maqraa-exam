/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CurriculumCountOrderByAggregateInputObjectSchema } from './CurriculumCountOrderByAggregateInput.schema'
import { CurriculumAvgOrderByAggregateInputObjectSchema } from './CurriculumAvgOrderByAggregateInput.schema'
import { CurriculumMaxOrderByAggregateInputObjectSchema } from './CurriculumMaxOrderByAggregateInput.schema'
import { CurriculumMinOrderByAggregateInputObjectSchema } from './CurriculumMinOrderByAggregateInput.schema'
import { CurriculumSumOrderByAggregateInputObjectSchema } from './CurriculumSumOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    fromPage: z.lazy(() => SortOrderSchema).optional(),
    toPage: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => CurriculumCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => CurriculumAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => CurriculumMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => CurriculumMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => CurriculumSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const CurriculumOrderByWithAggregationInputObjectSchema = Schema
