/* eslint-disable */
import { z } from 'zod'
import { CourseUpdateWithoutCyclesInputObjectSchema } from './CourseUpdateWithoutCyclesInput.schema'
import { CourseUncheckedUpdateWithoutCyclesInputObjectSchema } from './CourseUncheckedUpdateWithoutCyclesInput.schema'
import { CourseCreateWithoutCyclesInputObjectSchema } from './CourseCreateWithoutCyclesInput.schema'
import { CourseUncheckedCreateWithoutCyclesInputObjectSchema } from './CourseUncheckedCreateWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpsertWithoutCyclesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CourseUpdateWithoutCyclesInputObjectSchema),
      z.lazy(() => CourseUncheckedUpdateWithoutCyclesInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CourseCreateWithoutCyclesInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutCyclesInputObjectSchema),
    ]),
  })
  .strict()

export const CourseUpsertWithoutCyclesInputObjectSchema = Schema
