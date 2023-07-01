/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseMaxAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.literal(true).optional(),
    courseId: z.literal(true).optional(),
    cycleId: z.literal(true).optional(),
  })
  .strict()

export const CycleCourseMaxAggregateInputObjectSchema = Schema
