/* eslint-disable */
import { z } from 'zod'
import { CycleUpdateOneRequiredWithoutCoursesNestedInputObjectSchema } from './CycleUpdateOneRequiredWithoutCoursesNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    cycle: z
      .lazy(() => CycleUpdateOneRequiredWithoutCoursesNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleCourseUpdateWithoutCourseInputObjectSchema = Schema
