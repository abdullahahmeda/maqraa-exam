/* eslint-disable */
import { z } from 'zod'
import { TrackCountOutputTypeSelectObjectSchema } from './TrackCountOutputTypeSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCountOutputTypeArgs,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    select: z.lazy(() => TrackCountOutputTypeSelectObjectSchema).optional(),
  })
  .strict()

export const TrackCountOutputTypeArgsObjectSchema = Schema
