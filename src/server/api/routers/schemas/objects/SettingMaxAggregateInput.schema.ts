/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SettingMaxAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    key: z.literal(true).optional(),
    value: z.literal(true).optional(),
  })
  .strict()

export const SettingMaxAggregateInputObjectSchema = Schema
