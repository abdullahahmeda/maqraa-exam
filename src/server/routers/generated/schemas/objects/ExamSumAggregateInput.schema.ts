/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamSumAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    grade: z.literal(true).optional(),
  })
  .strict()

export const ExamSumAggregateInputObjectSchema = Schema
