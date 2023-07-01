/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutExamsInputObjectSchema } from './TrackCreateWithoutExamsInput.schema'
import { TrackUncheckedCreateWithoutExamsInputObjectSchema } from './TrackUncheckedCreateWithoutExamsInput.schema'
import { TrackCreateOrConnectWithoutExamsInputObjectSchema } from './TrackCreateOrConnectWithoutExamsInput.schema'
import { TrackUpsertWithoutExamsInputObjectSchema } from './TrackUpsertWithoutExamsInput.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackUpdateWithoutExamsInputObjectSchema } from './TrackUpdateWithoutExamsInput.schema'
import { TrackUncheckedUpdateWithoutExamsInputObjectSchema } from './TrackUncheckedUpdateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpdateOneRequiredWithoutExamsNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => TrackCreateWithoutExamsInputObjectSchema),
        z.lazy(() => TrackUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => TrackCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    upsert: z.lazy(() => TrackUpsertWithoutExamsInputObjectSchema).optional(),
    connect: z.lazy(() => TrackWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => TrackUpdateWithoutExamsInputObjectSchema),
        z.lazy(() => TrackUncheckedUpdateWithoutExamsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const TrackUpdateOneRequiredWithoutExamsNestedInputObjectSchema = Schema
