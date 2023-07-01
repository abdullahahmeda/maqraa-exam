/* eslint-disable */
import { z } from 'zod'
import { CycleUpdateOneRequiredWithoutCoursesNestedInputObjectSchema } from './CycleUpdateOneRequiredWithoutCoursesNestedInput.schema'
import { CourseUpdateOneRequiredWithoutCyclesNestedInputObjectSchema } from './CourseUpdateOneRequiredWithoutCyclesNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseUpdateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    cycle: z
      .lazy(() => CycleUpdateOneRequiredWithoutCoursesNestedInputObjectSchema)
      .optional(),
    course: z
      .lazy(() => CourseUpdateOneRequiredWithoutCyclesNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleCourseUpdateInputObjectSchema = Schema
