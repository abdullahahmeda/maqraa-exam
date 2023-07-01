/* eslint-disable */
import { z } from 'zod'
import { CycleCourseSchema } from '../CycleCourse.schema'
import { CycleCountOutputTypeArgsObjectSchema } from './CycleCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    courses: z
      .union([z.boolean(), z.lazy(() => CycleCourseSchema.findMany)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CycleCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CycleIncludeObjectSchema = Schema
