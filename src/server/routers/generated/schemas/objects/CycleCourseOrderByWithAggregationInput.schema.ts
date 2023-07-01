/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CycleCourseCountOrderByAggregateInputObjectSchema } from './CycleCourseCountOrderByAggregateInput.schema'
import { CycleCourseAvgOrderByAggregateInputObjectSchema } from './CycleCourseAvgOrderByAggregateInput.schema'
import { CycleCourseMaxOrderByAggregateInputObjectSchema } from './CycleCourseMaxOrderByAggregateInput.schema'
import { CycleCourseMinOrderByAggregateInputObjectSchema } from './CycleCourseMinOrderByAggregateInput.schema'
import { CycleCourseSumOrderByAggregateInputObjectSchema } from './CycleCourseSumOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    cycleId: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => CycleCourseCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => CycleCourseAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => CycleCourseMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => CycleCourseMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => CycleCourseSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleCourseOrderByWithAggregationInputObjectSchema = Schema
