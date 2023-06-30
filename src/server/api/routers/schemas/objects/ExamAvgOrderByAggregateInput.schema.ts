/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamAvgOrderByAggregateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    grade: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const ExamAvgOrderByAggregateInputObjectSchema = Schema
