/* eslint-disable */
import { z } from 'zod'
import { TrackArgsObjectSchema } from './TrackArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    fromPage: z.boolean().optional(),
    toPage: z.boolean().optional(),
    trackId: z.boolean().optional(),
    track: z
      .union([z.boolean(), z.lazy(() => TrackArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CurriculumSelectObjectSchema = Schema
