/* eslint-disable */
import { z } from 'zod'
import { TrackCreateManyCourseInputObjectSchema } from './TrackCreateManyCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateManyCourseInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => TrackCreateManyCourseInputObjectSchema),
      z.lazy(() => TrackCreateManyCourseInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const TrackCreateManyCourseInputEnvelopeObjectSchema = Schema
