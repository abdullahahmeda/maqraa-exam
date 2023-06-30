/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CourseCountOrderByAggregateInputObjectSchema } from './CourseCountOrderByAggregateInput.schema'
import { CourseMaxOrderByAggregateInputObjectSchema } from './CourseMaxOrderByAggregateInput.schema'
import { CourseMinOrderByAggregateInputObjectSchema } from './CourseMinOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => CourseCountOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z.lazy(() => CourseMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => CourseMinOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const CourseOrderByWithAggregationInputObjectSchema = Schema
