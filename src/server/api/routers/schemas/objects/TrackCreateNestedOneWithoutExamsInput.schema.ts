/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutExamsInputObjectSchema } from './TrackCreateWithoutExamsInput.schema'
import { TrackUncheckedCreateWithoutExamsInputObjectSchema } from './TrackUncheckedCreateWithoutExamsInput.schema'
import { TrackCreateOrConnectWithoutExamsInputObjectSchema } from './TrackCreateOrConnectWithoutExamsInput.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateNestedOneWithoutExamsInput,
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
    connect: z.lazy(() => TrackWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const TrackCreateNestedOneWithoutExamsInputObjectSchema = Schema
