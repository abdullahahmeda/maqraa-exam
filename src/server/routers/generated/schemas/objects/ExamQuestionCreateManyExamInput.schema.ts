/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateManyExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.number().optional(),
    questionId: z.string(),
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
  })
  .strict()

export const ExamQuestionCreateManyExamInputObjectSchema = Schema
