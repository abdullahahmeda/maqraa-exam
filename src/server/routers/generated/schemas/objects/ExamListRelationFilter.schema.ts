/* eslint-disable */
import { z } from 'zod'
import { ExamWhereInputObjectSchema } from './ExamWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamListRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    every: z.lazy(() => ExamWhereInputObjectSchema).optional(),
    some: z.lazy(() => ExamWhereInputObjectSchema).optional(),
    none: z.lazy(() => ExamWhereInputObjectSchema).optional(),
  })
  .strict()

export const ExamListRelationFilterObjectSchema = Schema
