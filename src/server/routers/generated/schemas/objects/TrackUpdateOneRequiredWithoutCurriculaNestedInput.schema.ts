/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutCurriculaInputObjectSchema } from './TrackCreateWithoutCurriculaInput.schema'
import { TrackUncheckedCreateWithoutCurriculaInputObjectSchema } from './TrackUncheckedCreateWithoutCurriculaInput.schema'
import { TrackCreateOrConnectWithoutCurriculaInputObjectSchema } from './TrackCreateOrConnectWithoutCurriculaInput.schema'
import { TrackUpsertWithoutCurriculaInputObjectSchema } from './TrackUpsertWithoutCurriculaInput.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackUpdateWithoutCurriculaInputObjectSchema } from './TrackUpdateWithoutCurriculaInput.schema'
import { TrackUncheckedUpdateWithoutCurriculaInputObjectSchema } from './TrackUncheckedUpdateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpdateOneRequiredWithoutCurriculaNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => TrackCreateWithoutCurriculaInputObjectSchema),
        z.lazy(() => TrackUncheckedCreateWithoutCurriculaInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => TrackCreateOrConnectWithoutCurriculaInputObjectSchema)
      .optional(),
    upsert: z
      .lazy(() => TrackUpsertWithoutCurriculaInputObjectSchema)
      .optional(),
    connect: z.lazy(() => TrackWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => TrackUpdateWithoutCurriculaInputObjectSchema),
        z.lazy(() => TrackUncheckedUpdateWithoutCurriculaInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const TrackUpdateOneRequiredWithoutCurriculaNestedInputObjectSchema =
  Schema
