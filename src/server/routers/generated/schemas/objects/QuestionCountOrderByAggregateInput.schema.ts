/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCountOrderByAggregateInput,
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
    option1: z.lazy(() => SortOrderSchema).optional(),
    option2: z.lazy(() => SortOrderSchema).optional(),
    option3: z.lazy(() => SortOrderSchema).optional(),
    option4: z.lazy(() => SortOrderSchema).optional(),
    textForTrue: z.lazy(() => SortOrderSchema).optional(),
    textForFalse: z.lazy(() => SortOrderSchema).optional(),
    answer: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const QuestionCountOrderByAggregateInputObjectSchema = Schema
