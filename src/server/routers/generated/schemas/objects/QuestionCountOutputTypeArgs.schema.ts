/* eslint-disable */
import { z } from 'zod'
import { QuestionCountOutputTypeSelectObjectSchema } from './QuestionCountOutputTypeSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCountOutputTypeArgs,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    select: z.lazy(() => QuestionCountOutputTypeSelectObjectSchema).optional(),
  })
  .strict()

export const QuestionCountOutputTypeArgsObjectSchema = Schema
