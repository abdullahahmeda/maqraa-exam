/* eslint-disable */
import { z } from 'zod'
import { CourseUpdateWithoutExamsInputObjectSchema } from './CourseUpdateWithoutExamsInput.schema'
import { CourseUncheckedUpdateWithoutExamsInputObjectSchema } from './CourseUncheckedUpdateWithoutExamsInput.schema'
import { CourseCreateWithoutExamsInputObjectSchema } from './CourseCreateWithoutExamsInput.schema'
import { CourseUncheckedCreateWithoutExamsInputObjectSchema } from './CourseUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpsertWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CourseUpdateWithoutExamsInputObjectSchema),
      z.lazy(() => CourseUncheckedUpdateWithoutExamsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CourseCreateWithoutExamsInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const CourseUpsertWithoutExamsInputObjectSchema = Schema
