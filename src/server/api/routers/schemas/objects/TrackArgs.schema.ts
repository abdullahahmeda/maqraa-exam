/* eslint-disable */
import { z } from 'zod'
import { TrackSelectObjectSchema } from './TrackSelect.schema'
import { TrackIncludeObjectSchema } from './TrackInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => TrackSelectObjectSchema).optional(),
    include: z.lazy(() => TrackIncludeObjectSchema).optional(),
  })
  .strict()

export const TrackArgsObjectSchema = Schema
