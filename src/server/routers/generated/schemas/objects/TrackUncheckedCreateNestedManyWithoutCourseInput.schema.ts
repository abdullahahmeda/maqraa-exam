/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutCourseInputObjectSchema } from './TrackCreateWithoutCourseInput.schema'
import { TrackUncheckedCreateWithoutCourseInputObjectSchema } from './TrackUncheckedCreateWithoutCourseInput.schema'
import { TrackCreateOrConnectWithoutCourseInputObjectSchema } from './TrackCreateOrConnectWithoutCourseInput.schema'
import { TrackCreateManyCourseInputEnvelopeObjectSchema } from './TrackCreateManyCourseInputEnvelope.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedCreateNestedManyWithoutCourseInput,
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
    createMany: z
      .lazy(() => TrackCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => TrackWhereUniqueInputObjectSchema),
        z.lazy(() => TrackWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const TrackUncheckedCreateNestedManyWithoutCourseInputObjectSchema =
  Schema
