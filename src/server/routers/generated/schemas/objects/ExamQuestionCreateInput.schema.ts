/* eslint-disable */
import { z } from 'zod'
import { ExamCreateNestedOneWithoutQuestionsInputObjectSchema } from './ExamCreateNestedOneWithoutQuestionsInput.schema'
import { QuestionCreateNestedOneWithoutExamsInputObjectSchema } from './QuestionCreateNestedOneWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
    exam: z.lazy(() => ExamCreateNestedOneWithoutQuestionsInputObjectSchema),
    question: z.lazy(
      () => QuestionCreateNestedOneWithoutExamsInputObjectSchema
    ),
  })
  .strict()

export const ExamQuestionCreateInputObjectSchema = Schema
