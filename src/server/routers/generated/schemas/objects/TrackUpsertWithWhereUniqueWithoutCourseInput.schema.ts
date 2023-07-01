/* eslint-disable */
import { z } from 'zod'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackUpdateWithoutCourseInputObjectSchema } from './TrackUpdateWithoutCourseInput.schema'
import { TrackUncheckedUpdateWithoutCourseInputObjectSchema } from './TrackUncheckedUpdateWithoutCourseInput.schema'
import { TrackCreateWithoutCourseInputObjectSchema } from './TrackCreateWithoutCourseInput.schema'
import { TrackUncheckedCreateWithoutCourseInputObjectSchema } from './TrackUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpsertWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => TrackUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => TrackUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => TrackCreateWithoutCourseInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const TrackUpsertWithWhereUniqueWithoutCourseInputObjectSchema = Schema
