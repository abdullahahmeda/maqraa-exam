/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'
import { ExamCountOrderByAggregateInputObjectSchema } from './ExamCountOrderByAggregateInput.schema'
import { ExamAvgOrderByAggregateInputObjectSchema } from './ExamAvgOrderByAggregateInput.schema'
import { ExamMaxOrderByAggregateInputObjectSchema } from './ExamMaxOrderByAggregateInput.schema'
import { ExamMinOrderByAggregateInputObjectSchema } from './ExamMinOrderByAggregateInput.schema'
import { ExamSumOrderByAggregateInputObjectSchema } from './ExamSumOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    difficulty: z.lazy(() => SortOrderSchema).optional(),
    userId: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    grade: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    submittedAt: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    curriculumId: z.lazy(() => SortOrderSchema).optional(),
    _count: z.lazy(() => ExamCountOrderByAggregateInputObjectSchema).optional(),
    _avg: z.lazy(() => ExamAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => ExamMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => ExamMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => ExamSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const ExamOrderByWithAggregationInputObjectSchema = Schema
