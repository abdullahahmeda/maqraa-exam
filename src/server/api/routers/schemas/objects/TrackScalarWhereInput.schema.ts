/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackScalarWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TrackScalarWhereInputObjectSchema),
        z.lazy(() => TrackScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TrackScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TrackScalarWhereInputObjectSchema),
        z.lazy(() => TrackScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    courseId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict()

export const TrackScalarWhereInputObjectSchema = Schema
