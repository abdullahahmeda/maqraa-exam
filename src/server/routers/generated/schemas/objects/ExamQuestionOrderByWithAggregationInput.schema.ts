/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'
import { ExamQuestionCountOrderByAggregateInputObjectSchema } from './ExamQuestionCountOrderByAggregateInput.schema'
import { ExamQuestionAvgOrderByAggregateInputObjectSchema } from './ExamQuestionAvgOrderByAggregateInput.schema'
import { ExamQuestionMaxOrderByAggregateInputObjectSchema } from './ExamQuestionMaxOrderByAggregateInput.schema'
import { ExamQuestionMinOrderByAggregateInputObjectSchema } from './ExamQuestionMinOrderByAggregateInput.schema'
import { ExamQuestionSumOrderByAggregateInputObjectSchema } from './ExamQuestionSumOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    examId: z.lazy(() => SortOrderSchema).optional(),
    questionId: z.lazy(() => SortOrderSchema).optional(),
    answer: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    isCorrect: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => ExamQuestionCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => ExamQuestionAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => ExamQuestionMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => ExamQuestionMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => ExamQuestionSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamQuestionOrderByWithAggregationInputObjectSchema = Schema
