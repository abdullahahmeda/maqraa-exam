/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateWithoutCycleInputObjectSchema } from './CycleCourseCreateWithoutCycleInput.schema'
import { CycleCourseUncheckedCreateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCycleInput.schema'
import { CycleCourseCreateOrConnectWithoutCycleInputObjectSchema } from './CycleCourseCreateOrConnectWithoutCycleInput.schema'
import { CycleCourseUpsertWithWhereUniqueWithoutCycleInputObjectSchema } from './CycleCourseUpsertWithWhereUniqueWithoutCycleInput.schema'
import { CycleCourseCreateManyCycleInputEnvelopeObjectSchema } from './CycleCourseCreateManyCycleInputEnvelope.schema'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithWhereUniqueWithoutCycleInputObjectSchema } from './CycleCourseUpdateWithWhereUniqueWithoutCycleInput.schema'
import { CycleCourseUpdateManyWithWhereWithoutCycleInputObjectSchema } from './CycleCourseUpdateManyWithWhereWithoutCycleInput.schema'
import { CycleCourseScalarWhereInputObjectSchema } from './CycleCourseScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUncheckedUpdateManyWithoutCycleNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema),
        z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema).array(),
        z.lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema),
        z
          .lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CycleCourseCreateOrConnectWithoutCycleInputObjectSchema),
        z
          .lazy(() => CycleCourseCreateOrConnectWithoutCycleInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(
          () => CycleCourseUpsertWithWhereUniqueWithoutCycleInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpsertWithWhereUniqueWithoutCycleInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CycleCourseCreateManyCycleInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(
          () => CycleCourseUpdateWithWhereUniqueWithoutCycleInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpdateWithWhereUniqueWithoutCycleInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => CycleCourseUpdateManyWithWhereWithoutCycleInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpdateManyWithWhereWithoutCycleInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => CycleCourseScalarWhereInputObjectSchema),
        z.lazy(() => CycleCourseScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CycleCourseUncheckedUpdateManyWithoutCycleNestedInputObjectSchema =
  Schema
