/* eslint-disable */
import { z } from 'zod'
import { CycleArgsObjectSchema } from './CycleArgs.schema'
import { CourseArgsObjectSchema } from './CourseArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    cycle: z
      .union([z.boolean(), z.lazy(() => CycleArgsObjectSchema)])
      .optional(),
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CycleCourseIncludeObjectSchema = Schema
