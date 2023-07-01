/* eslint-disable */
import { z } from 'zod'
import { CourseUpdateOneRequiredWithoutCyclesNestedInputObjectSchema } from './CourseUpdateOneRequiredWithoutCyclesNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    course: z
      .lazy(() => CourseUpdateOneRequiredWithoutCyclesNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleCourseUpdateWithoutCycleInputObjectSchema = Schema
