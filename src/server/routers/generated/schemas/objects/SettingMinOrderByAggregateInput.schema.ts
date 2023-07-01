/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SettingMinOrderByAggregateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    key: z.lazy(() => SortOrderSchema).optional(),
    value: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict()

export const SettingMinOrderByAggregateInputObjectSchema = Schema
