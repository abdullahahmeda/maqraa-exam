/* eslint-disable */
import { z } from 'zod'
import { TrackUpdateWithoutExamsInputObjectSchema } from './TrackUpdateWithoutExamsInput.schema'
import { TrackUncheckedUpdateWithoutExamsInputObjectSchema } from './TrackUncheckedUpdateWithoutExamsInput.schema'
import { TrackCreateWithoutExamsInputObjectSchema } from './TrackCreateWithoutExamsInput.schema'
import { TrackUncheckedCreateWithoutExamsInputObjectSchema } from './TrackUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpsertWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => TrackUpdateWithoutExamsInputObjectSchema),
      z.lazy(() => TrackUncheckedUpdateWithoutExamsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => TrackCreateWithoutExamsInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const TrackUpsertWithoutExamsInputObjectSchema = Schema
