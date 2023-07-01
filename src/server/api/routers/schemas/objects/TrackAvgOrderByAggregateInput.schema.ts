/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackAvgOrderByAggregateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    fromPage: z.lazy(() => SortOrderSchema).optional(),
    toPage: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const TrackAvgOrderByAggregateInputObjectSchema = Schema
