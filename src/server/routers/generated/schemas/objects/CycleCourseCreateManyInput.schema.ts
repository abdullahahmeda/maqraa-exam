/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateManyInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.number().optional(),
    courseId: z.string(),
    cycleId: z.string(),
  })
  .strict()

export const CycleCourseCreateManyInputObjectSchema = Schema
