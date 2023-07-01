/* eslint-disable */
import { z } from 'zod'
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackScalarWhereWithAggregatesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TrackScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => TrackScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TrackScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TrackScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => TrackScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    courseId: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict()

export const TrackScalarWhereWithAggregatesInputObjectSchema = Schema
