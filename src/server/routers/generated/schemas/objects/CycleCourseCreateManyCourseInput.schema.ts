/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateManyCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.number().optional(),
    cycleId: z.string(),
  })
  .strict()

export const CycleCourseCreateManyCourseInputObjectSchema = Schema
