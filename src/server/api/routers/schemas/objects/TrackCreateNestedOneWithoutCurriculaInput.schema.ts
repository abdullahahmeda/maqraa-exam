/* eslint-disable */
import { z } from 'zod'
import { TrackCreateWithoutCurriculaInputObjectSchema } from './TrackCreateWithoutCurriculaInput.schema'
import { TrackUncheckedCreateWithoutCurriculaInputObjectSchema } from './TrackUncheckedCreateWithoutCurriculaInput.schema'
import { TrackCreateOrConnectWithoutCurriculaInputObjectSchema } from './TrackCreateOrConnectWithoutCurriculaInput.schema'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateNestedOneWithoutCurriculaInput,
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
    connect: z.lazy(() => TrackWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const TrackCreateNestedOneWithoutCurriculaInputObjectSchema = Schema
