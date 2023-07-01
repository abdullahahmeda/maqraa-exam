/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackSumAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    fromPage: z.literal(true).optional(),
    toPage: z.literal(true).optional(),
  })
  .strict()

export const TrackSumAggregateInputObjectSchema = Schema
