/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereInputObjectSchema } from './QuestionWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionListRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    every: z.lazy(() => QuestionWhereInputObjectSchema).optional(),
    some: z.lazy(() => QuestionWhereInputObjectSchema).optional(),
    none: z.lazy(() => QuestionWhereInputObjectSchema).optional(),
  })
  .strict()

export const QuestionListRelationFilterObjectSchema = Schema
