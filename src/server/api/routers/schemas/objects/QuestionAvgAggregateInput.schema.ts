/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionAvgAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    number: z.literal(true).optional(),
    pageNumber: z.literal(true).optional(),
    partNumber: z.literal(true).optional(),
    hadithNumber: z.literal(true).optional(),
  })
  .strict()

export const QuestionAvgAggregateInputObjectSchema = Schema
