/* eslint-disable */
import { z } from 'zod'
import { TrackScalarWhereInputObjectSchema } from './TrackScalarWhereInput.schema'
import { TrackUpdateManyMutationInputObjectSchema } from './TrackUpdateManyMutationInput.schema'
import { TrackUncheckedUpdateManyWithoutCurriculaInputObjectSchema } from './TrackUncheckedUpdateManyWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpdateManyWithWhereWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => TrackUpdateManyMutationInputObjectSchema),
      z.lazy(() => TrackUncheckedUpdateManyWithoutCurriculaInputObjectSchema),
    ]),
  })
  .strict()

export const TrackUpdateManyWithWhereWithoutCourseInputObjectSchema = Schema
