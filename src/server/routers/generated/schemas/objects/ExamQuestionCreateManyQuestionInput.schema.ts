/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateManyQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.number().optional(),
    examId: z.string(),
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
  })
  .strict()

export const ExamQuestionCreateManyQuestionInputObjectSchema = Schema
