/* eslint-disable */
import { z } from 'zod'
import { CycleCreateNestedOneWithoutCoursesInputObjectSchema } from './CycleCreateNestedOneWithoutCoursesInput.schema'
import { CourseCreateNestedOneWithoutCyclesInputObjectSchema } from './CourseCreateNestedOneWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseCreateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    cycle: z.lazy(() => CycleCreateNestedOneWithoutCoursesInputObjectSchema),
    course: z.lazy(() => CourseCreateNestedOneWithoutCyclesInputObjectSchema),
  })
  .strict()

export const CycleCourseCreateInputObjectSchema = Schema
