/* eslint-disable */
import { z } from 'zod'
import { CourseUpdateWithoutCurriculaInputObjectSchema } from './CourseUpdateWithoutCurriculaInput.schema'
import { CourseUncheckedUpdateWithoutCurriculaInputObjectSchema } from './CourseUncheckedUpdateWithoutCurriculaInput.schema'
import { CourseCreateWithoutCurriculaInputObjectSchema } from './CourseCreateWithoutCurriculaInput.schema'
import { CourseUncheckedCreateWithoutCurriculaInputObjectSchema } from './CourseUncheckedCreateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpsertWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CourseUpdateWithoutCurriculaInputObjectSchema),
      z.lazy(() => CourseUncheckedUpdateWithoutCurriculaInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CourseCreateWithoutCurriculaInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutCurriculaInputObjectSchema),
    ]),
  })
  .strict()

export const CourseUpsertWithoutCurriculaInputObjectSchema = Schema
