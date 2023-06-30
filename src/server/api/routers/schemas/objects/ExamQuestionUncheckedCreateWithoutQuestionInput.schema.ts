/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUncheckedCreateWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    examId: z.string(),
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
  })
  .strict()

export const ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema =
  Schema
