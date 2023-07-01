/* eslint-disable */
import { z } from 'zod'
import { CycleCountOutputTypeSelectObjectSchema } from './CycleCountOutputTypeSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCountOutputTypeArgs,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    select: z.lazy(() => CycleCountOutputTypeSelectObjectSchema).optional(),
  })
  .strict()

export const CycleCountOutputTypeArgsObjectSchema = Schema
