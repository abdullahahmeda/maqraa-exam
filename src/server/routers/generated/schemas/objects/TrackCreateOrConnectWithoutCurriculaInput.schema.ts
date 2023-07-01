/* eslint-disable */
import { z } from 'zod'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackCreateWithoutCurriculaInputObjectSchema } from './TrackCreateWithoutCurriculaInput.schema'
import { TrackUncheckedCreateWithoutCurriculaInputObjectSchema } from './TrackUncheckedCreateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateOrConnectWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => TrackCreateWithoutCurriculaInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutCurriculaInputObjectSchema),
    ]),
  })
  .strict()

export const TrackCreateOrConnectWithoutCurriculaInputObjectSchema = Schema
