/* eslint-disable */
import { z } from 'zod'
import { TrackWhereUniqueInputObjectSchema } from './TrackWhereUniqueInput.schema'
import { TrackCreateWithoutCourseInputObjectSchema } from './TrackCreateWithoutCourseInput.schema'
import { TrackUncheckedCreateWithoutCourseInputObjectSchema } from './TrackUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateOrConnectWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => TrackWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => TrackCreateWithoutCourseInputObjectSchema),
      z.lazy(() => TrackUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const TrackCreateOrConnectWithoutCourseInputObjectSchema = Schema
