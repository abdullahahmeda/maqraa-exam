/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereInputObjectSchema } from './QuestionWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.QuestionRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    is: z
      .lazy(() => QuestionWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => QuestionWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const QuestionRelationFilterObjectSchema = Schema
