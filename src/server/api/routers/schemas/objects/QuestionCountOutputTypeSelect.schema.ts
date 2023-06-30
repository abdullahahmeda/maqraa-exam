/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCountOutputTypeSelect,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    exams: z.boolean().optional(),
  })
  .strict()

export const QuestionCountOutputTypeSelectObjectSchema = Schema
