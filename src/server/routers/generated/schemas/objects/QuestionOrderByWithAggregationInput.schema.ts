/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'
import { QuestionCountOrderByAggregateInputObjectSchema } from './QuestionCountOrderByAggregateInput.schema'
import { QuestionAvgOrderByAggregateInputObjectSchema } from './QuestionAvgOrderByAggregateInput.schema'
import { QuestionMaxOrderByAggregateInputObjectSchema } from './QuestionMaxOrderByAggregateInput.schema'
import { QuestionMinOrderByAggregateInputObjectSchema } from './QuestionMinOrderByAggregateInput.schema'
import { QuestionSumOrderByAggregateInputObjectSchema } from './QuestionSumOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    number: z.lazy(() => SortOrderSchema).optional(),
    pageNumber: z.lazy(() => SortOrderSchema).optional(),
    partNumber: z.lazy(() => SortOrderSchema).optional(),
    hadithNumber: z.lazy(() => SortOrderSchema).optional(),
    text: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    style: z.lazy(() => SortOrderSchema).optional(),
    difficulty: z.lazy(() => SortOrderSchema).optional(),
    option1: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    option2: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    option3: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    option4: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    textForTrue: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    textForFalse: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    answer: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => QuestionCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z.lazy(() => QuestionAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => QuestionMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => QuestionMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => QuestionSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const QuestionOrderByWithAggregationInputObjectSchema = Schema
