/* eslint-disable */
import { z } from 'zod'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackCreateWithoutExamsInputObjectSchema } from './TrackCreateWithoutExamsInput.schema'
import { TrackUncheckedCreateWithoutExamsInputObjectSchema } from './TrackUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateOrConnectWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => TrackCreateWithoutExamsInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const TrackCreateOrConnectWithoutExamsInputObjectSchema = Schema
