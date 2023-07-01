/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateNestedOneWithoutExamsInputObjectSchema } from './QuestionCreateNestedOneWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateWithoutExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
    question: z.lazy(
      () => QuestionCreateNestedOneWithoutExamsInputObjectSchema
    ),
  })
  .strict()

export const ExamQuestionCreateWithoutExamInputObjectSchema = Schema
