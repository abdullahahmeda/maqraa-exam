/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCountAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.literal(true).optional(),
    examId: z.literal(true).optional(),
    questionId: z.literal(true).optional(),
    answer: z.literal(true).optional(),
    isCorrect: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict()

export const ExamQuestionCountAggregateInputObjectSchema = Schema
