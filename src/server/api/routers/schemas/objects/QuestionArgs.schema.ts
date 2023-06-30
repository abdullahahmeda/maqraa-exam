/* eslint-disable */
import { z } from 'zod'
import { QuestionSelectObjectSchema } from './QuestionSelect.schema'
import { QuestionIncludeObjectSchema } from './QuestionInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.QuestionArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => QuestionSelectObjectSchema).optional(),
    include: z.lazy(() => QuestionIncludeObjectSchema).optional(),
  })
  .strict()

export const QuestionArgsObjectSchema = Schema
