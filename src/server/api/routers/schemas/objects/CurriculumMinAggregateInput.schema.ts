/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumMinAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.literal(true).optional(),
    name: z.literal(true).optional(),
    fromPage: z.literal(true).optional(),
    toPage: z.literal(true).optional(),
    trackId: z.literal(true).optional(),
  })
  .strict()

export const CurriculumMinAggregateInputObjectSchema = Schema
