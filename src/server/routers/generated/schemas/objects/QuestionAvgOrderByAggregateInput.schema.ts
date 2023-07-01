/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionAvgOrderByAggregateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    number: z.lazy(() => SortOrderSchema).optional(),
    pageNumber: z.lazy(() => SortOrderSchema).optional(),
    partNumber: z.lazy(() => SortOrderSchema).optional(),
    hadithNumber: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const QuestionAvgOrderByAggregateInputObjectSchema = Schema
