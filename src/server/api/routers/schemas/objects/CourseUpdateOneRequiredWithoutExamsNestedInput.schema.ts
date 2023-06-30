/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutExamsInputObjectSchema } from './CourseCreateWithoutExamsInput.schema'
import { CourseUncheckedCreateWithoutExamsInputObjectSchema } from './CourseUncheckedCreateWithoutExamsInput.schema'
import { CourseCreateOrConnectWithoutExamsInputObjectSchema } from './CourseCreateOrConnectWithoutExamsInput.schema'
import { CourseUpsertWithoutExamsInputObjectSchema } from './CourseUpsertWithoutExamsInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseUpdateWithoutExamsInputObjectSchema } from './CourseUpdateWithoutExamsInput.schema'
import { CourseUncheckedUpdateWithoutExamsInputObjectSchema } from './CourseUncheckedUpdateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpdateOneRequiredWithoutExamsNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutExamsInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    upsert: z.lazy(() => CourseUpsertWithoutExamsInputObjectSchema).optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CourseUpdateWithoutExamsInputObjectSchema),
        z.lazy(() => CourseUncheckedUpdateWithoutExamsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CourseUpdateOneRequiredWithoutExamsNestedInputObjectSchema = Schema
