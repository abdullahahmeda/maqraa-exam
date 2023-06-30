/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionMaxAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.literal(true).optional(),
    number: z.literal(true).optional(),
    pageNumber: z.literal(true).optional(),
    partNumber: z.literal(true).optional(),
    hadithNumber: z.literal(true).optional(),
    text: z.literal(true).optional(),
    type: z.literal(true).optional(),
    style: z.literal(true).optional(),
    difficulty: z.literal(true).optional(),
    option1: z.literal(true).optional(),
    option2: z.literal(true).optional(),
    option3: z.literal(true).optional(),
    option4: z.literal(true).optional(),
    textForTrue: z.literal(true).optional(),
    textForFalse: z.literal(true).optional(),
    answer: z.literal(true).optional(),
    courseId: z.literal(true).optional(),
  })
  .strict()

export const QuestionMaxAggregateInputObjectSchema = Schema
