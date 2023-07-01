/* eslint-disable */
import { z } from 'zod'
import { TrackArgsObjectSchema } from './TrackArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    track: z
      .union([z.boolean(), z.lazy(() => TrackArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CurriculumIncludeObjectSchema = Schema
