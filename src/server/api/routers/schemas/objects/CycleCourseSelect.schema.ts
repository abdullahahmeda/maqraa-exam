/* eslint-disable */
import { z } from 'zod'
import { CycleArgsObjectSchema } from './CycleArgs.schema'
import { CourseArgsObjectSchema } from './CourseArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    courseId: z.boolean().optional(),
    cycleId: z.boolean().optional(),
    cycle: z
      .union([z.boolean(), z.lazy(() => CycleArgsObjectSchema)])
      .optional(),
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CycleCourseSelectObjectSchema = Schema
