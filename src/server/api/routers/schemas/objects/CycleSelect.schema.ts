/* eslint-disable */
import { z } from 'zod'
import { CycleCourseSchema } from '../CycleCourse.schema'
import { CycleCountOutputTypeArgsObjectSchema } from './CycleCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    courses: z
      .union([z.boolean(), z.lazy(() => CycleCourseSchema.findMany)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CycleCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CycleSelectObjectSchema = Schema
