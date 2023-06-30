/* eslint-disable */
import { z } from 'zod'
import { ExamWhereInputObjectSchema } from './ExamWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    is: z
      .lazy(() => ExamWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => ExamWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const ExamRelationFilterObjectSchema = Schema
