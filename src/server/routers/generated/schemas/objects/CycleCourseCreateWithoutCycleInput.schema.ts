/* eslint-disable */
import { z } from 'zod'
import { CourseCreateNestedOneWithoutCyclesInputObjectSchema } from './CourseCreateNestedOneWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    course: z.lazy(() => CourseCreateNestedOneWithoutCyclesInputObjectSchema),
  })
  .strict()

export const CycleCourseCreateWithoutCycleInputObjectSchema = Schema
