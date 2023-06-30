/* eslint-disable */
import { z } from 'zod'
import { ExamArgsObjectSchema } from './ExamArgs.schema'
import { QuestionArgsObjectSchema } from './QuestionArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamQuestionSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    examId: z.boolean().optional(),
    questionId: z.boolean().optional(),
    answer: z.boolean().optional(),
    isCorrect: z.boolean().optional(),
    exam: z.union([z.boolean(), z.lazy(() => ExamArgsObjectSchema)]).optional(),
    question: z
      .union([z.boolean(), z.lazy(() => QuestionArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const ExamQuestionSelectObjectSchema = Schema
