/* eslint-disable */
import { z } from 'zod'
import { CycleCreateNestedOneWithoutCoursesInputObjectSchema } from './CycleCreateNestedOneWithoutCoursesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    cycle: z.lazy(() => CycleCreateNestedOneWithoutCoursesInputObjectSchema),
  })
  .strict()

export const CycleCourseCreateWithoutCourseInputObjectSchema = Schema
