/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { TrackOrderByWithRelationInputObjectSchema } from './TrackOrderByWithRelationInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    fromPage: z.lazy(() => SortOrderSchema).optional(),
    toPage: z.lazy(() => SortOrderSchema).optional(),
    trackId: z.lazy(() => SortOrderSchema).optional(),
    track: z.lazy(() => TrackOrderByWithRelationInputObjectSchema).optional(),
  })
  .strict()

export const CurriculumOrderByWithRelationInputObjectSchema = Schema
