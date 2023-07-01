/* eslint-disable */
import { z } from 'zod'
import { TrackWhereInputObjectSchema } from './TrackWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    is: z
      .lazy(() => TrackWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => TrackWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const TrackRelationFilterObjectSchema = Schema
