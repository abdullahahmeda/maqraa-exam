/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateWithoutCourseInputObjectSchema } from './CycleCourseCreateWithoutCourseInput.schema'
import { CycleCourseUncheckedCreateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCourseInput.schema'
import { CycleCourseCreateOrConnectWithoutCourseInputObjectSchema } from './CycleCourseCreateOrConnectWithoutCourseInput.schema'
import { CycleCourseUpsertWithWhereUniqueWithoutCourseInputObjectSchema } from './CycleCourseUpsertWithWhereUniqueWithoutCourseInput.schema'
import { CycleCourseCreateManyCourseInputEnvelopeObjectSchema } from './CycleCourseCreateManyCourseInputEnvelope.schema'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithWhereUniqueWithoutCourseInputObjectSchema } from './CycleCourseUpdateWithWhereUniqueWithoutCourseInput.schema'
import { CycleCourseUpdateManyWithWhereWithoutCourseInputObjectSchema } from './CycleCourseUpdateManyWithWhereWithoutCourseInput.schema'
import { CycleCourseScalarWhereInputObjectSchema } from './CycleCourseScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUncheckedUpdateManyWithoutCourseNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema),
        z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema),
        z
          .lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CycleCourseCreateOrConnectWithoutCourseInputObjectSchema),
        z
          .lazy(() => CycleCourseCreateOrConnectWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(
          () => CycleCourseUpsertWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpsertWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CycleCourseCreateManyCourseInputEnvelopeObjectSchema)
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
          () => CycleCourseUpdateWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpdateWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => CycleCourseUpdateManyWithWhereWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CycleCourseUpdateManyWithWhereWithoutCourseInputObjectSchema
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

export const CycleCourseUncheckedUpdateManyWithoutCourseNestedInputObjectSchema =
  Schema
