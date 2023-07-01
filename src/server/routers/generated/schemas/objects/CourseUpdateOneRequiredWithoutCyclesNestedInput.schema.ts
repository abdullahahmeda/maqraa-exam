/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutCyclesInputObjectSchema } from './CourseCreateWithoutCyclesInput.schema'
import { CourseUncheckedCreateWithoutCyclesInputObjectSchema } from './CourseUncheckedCreateWithoutCyclesInput.schema'
import { CourseCreateOrConnectWithoutCyclesInputObjectSchema } from './CourseCreateOrConnectWithoutCyclesInput.schema'
import { CourseUpsertWithoutCyclesInputObjectSchema } from './CourseUpsertWithoutCyclesInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseUpdateWithoutCyclesInputObjectSchema } from './CourseUpdateWithoutCyclesInput.schema'
import { CourseUncheckedUpdateWithoutCyclesInputObjectSchema } from './CourseUncheckedUpdateWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpdateOneRequiredWithoutCyclesNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutCyclesInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutCyclesInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutCyclesInputObjectSchema)
      .optional(),
    upsert: z.lazy(() => CourseUpsertWithoutCyclesInputObjectSchema).optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CourseUpdateWithoutCyclesInputObjectSchema),
        z.lazy(() => CourseUncheckedUpdateWithoutCyclesInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CourseUpdateOneRequiredWithoutCyclesNestedInputObjectSchema =
  Schema
