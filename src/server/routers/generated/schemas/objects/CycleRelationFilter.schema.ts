/* eslint-disable */
import { z } from 'zod'
import { CycleWhereInputObjectSchema } from './CycleWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    is: z
      .lazy(() => CycleWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => CycleWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const CycleRelationFilterObjectSchema = Schema
