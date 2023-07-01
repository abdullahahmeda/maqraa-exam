/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutCourseInputObjectSchema } from './TrackCreateWithoutCourseInput.schema'
import { TrackUncheckedCreateWithoutCourseInputObjectSchema } from './TrackUncheckedCreateWithoutCourseInput.schema'
import { TrackCreateOrConnectWithoutCourseInputObjectSchema } from './TrackCreateOrConnectWithoutCourseInput.schema'
import { TrackUpsertWithWhereUniqueWithoutCourseInputObjectSchema } from './TrackUpsertWithWhereUniqueWithoutCourseInput.schema'
import { TrackCreateManyCourseInputEnvelopeObjectSchema } from './TrackCreateManyCourseInputEnvelope.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackUpdateWithWhereUniqueWithoutCourseInputObjectSchema } from './TrackUpdateWithWhereUniqueWithoutCourseInput.schema'
import { TrackUpdateManyWithWhereWithoutCourseInputObjectSchema } from './TrackUpdateManyWithWhereWithoutCourseInput.schema'
import { TrackScalarWhereInputObjectSchema } from './TrackScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedUpdateManyWithoutCourseNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => TrackCreateWithoutCourseInputObjectSchema),
        z.lazy(() => TrackCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => TrackUncheckedCreateWithoutCourseInputObjectSchema),
        z
          .lazy(() => TrackUncheckedCreateWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => TrackCreateOrConnectWithoutCourseInputObjectSchema),
        z
          .lazy(() => TrackCreateOrConnectWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(() => TrackUpsertWithWhereUniqueWithoutCourseInputObjectSchema),
        z
          .lazy(() => TrackUpsertWithWhereUniqueWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => TrackCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => TrackWhereUniqueInputObjectSchema),
        z.lazy(() => TrackWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => TrackWhereUniqueInputObjectSchema),
        z.lazy(() => TrackWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => TrackWhereUniqueInputObjectSchema),
        z.lazy(() => TrackWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => TrackWhereUniqueInputObjectSchema),
        z.lazy(() => TrackWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(() => TrackUpdateWithWhereUniqueWithoutCourseInputObjectSchema),
        z
          .lazy(() => TrackUpdateWithWhereUniqueWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => TrackUpdateManyWithWhereWithoutCourseInputObjectSchema),
        z
          .lazy(() => TrackUpdateManyWithWhereWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => TrackScalarWhereInputObjectSchema),
        z.lazy(() => TrackScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const TrackUncheckedUpdateManyWithoutCourseNestedInputObjectSchema =
  Schema
