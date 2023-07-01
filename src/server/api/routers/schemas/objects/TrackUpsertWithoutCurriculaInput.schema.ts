/* eslint-disable */
import { z } from 'zod'
import { TrackUpdateWithoutCurriculaInputObjectSchema } from './TrackUpdateWithoutCurriculaInput.schema'
import { TrackUncheckedUpdateWithoutCurriculaInputObjectSchema } from './TrackUncheckedUpdateWithoutCurriculaInput.schema'
import { TrackCreateWithoutCurriculaInputObjectSchema } from './TrackCreateWithoutCurriculaInput.schema'
import { TrackUncheckedCreateWithoutCurriculaInputObjectSchema } from './TrackUncheckedCreateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpsertWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => TrackUpdateWithoutCurriculaInputObjectSchema),
      z.lazy(() => TrackUncheckedUpdateWithoutCurriculaInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => TrackCreateWithoutCurriculaInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutCurriculaInputObjectSchema),
    ]),
  })
  .strict()

export const TrackUpsertWithoutCurriculaInputObjectSchema = Schema
