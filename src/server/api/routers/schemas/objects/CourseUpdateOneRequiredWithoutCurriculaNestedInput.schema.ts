/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutCurriculaInputObjectSchema } from './CourseCreateWithoutCurriculaInput.schema'
import { CourseUncheckedCreateWithoutCurriculaInputObjectSchema } from './CourseUncheckedCreateWithoutCurriculaInput.schema'
import { CourseCreateOrConnectWithoutCurriculaInputObjectSchema } from './CourseCreateOrConnectWithoutCurriculaInput.schema'
import { CourseUpsertWithoutCurriculaInputObjectSchema } from './CourseUpsertWithoutCurriculaInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseUpdateWithoutCurriculaInputObjectSchema } from './CourseUpdateWithoutCurriculaInput.schema'
import { CourseUncheckedUpdateWithoutCurriculaInputObjectSchema } from './CourseUncheckedUpdateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpdateOneRequiredWithoutCurriculaNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutCurriculaInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutCurriculaInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutCurriculaInputObjectSchema)
      .optional(),
    upsert: z
      .lazy(() => CourseUpsertWithoutCurriculaInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CourseUpdateWithoutCurriculaInputObjectSchema),
        z.lazy(() => CourseUncheckedUpdateWithoutCurriculaInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CourseUpdateOneRequiredWithoutCurriculaNestedInputObjectSchema =
  Schema
