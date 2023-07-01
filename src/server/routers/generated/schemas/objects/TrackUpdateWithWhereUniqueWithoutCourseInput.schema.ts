/* eslint-disable */
import { z } from 'zod'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackUpdateWithoutCourseInputObjectSchema } from './TrackUpdateWithoutCourseInput.schema'
import { TrackUncheckedUpdateWithoutCourseInputObjectSchema } from './TrackUncheckedUpdateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpdateWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => TrackUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => TrackUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const TrackUpdateWithWhereUniqueWithoutCourseInputObjectSchema = Schema
