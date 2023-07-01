/* eslint-disable */
import { z } from 'zod'
import { TrackWhereInputObjectSchema } from './TrackWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackListRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    every: z.lazy(() => TrackWhereInputObjectSchema).optional(),
    some: z.lazy(() => TrackWhereInputObjectSchema).optional(),
    none: z.lazy(() => TrackWhereInputObjectSchema).optional(),
  })
  .strict()

export const TrackListRelationFilterObjectSchema = Schema
