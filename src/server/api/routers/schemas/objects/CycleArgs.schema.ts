/* eslint-disable */
import { z } from 'zod'
import { CycleSelectObjectSchema } from './CycleSelect.schema'
import { CycleIncludeObjectSchema } from './CycleInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => CycleSelectObjectSchema).optional(),
    include: z.lazy(() => CycleIncludeObjectSchema).optional(),
  })
  .strict()

export const CycleArgsObjectSchema = Schema
