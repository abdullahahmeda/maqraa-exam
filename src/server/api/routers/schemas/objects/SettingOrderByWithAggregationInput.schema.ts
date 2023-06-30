/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SettingCountOrderByAggregateInputObjectSchema } from './SettingCountOrderByAggregateInput.schema'
import { SettingMaxOrderByAggregateInputObjectSchema } from './SettingMaxOrderByAggregateInput.schema'
import { SettingMinOrderByAggregateInputObjectSchema } from './SettingMinOrderByAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SettingOrderByWithAggregationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    key: z.lazy(() => SortOrderSchema).optional(),
    value: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => SettingCountOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z.lazy(() => SettingMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => SettingMinOrderByAggregateInputObjectSchema).optional(),
  })
  .strict()

export const SettingOrderByWithAggregationInputObjectSchema = Schema
