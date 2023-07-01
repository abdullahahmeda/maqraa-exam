/* eslint-disable */
import { z } from 'zod'
import { ExamCreateNestedOneWithoutQuestionsInputObjectSchema } from './ExamCreateNestedOneWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    answer: z.string().optional().nullable(),
    isCorrect: z.boolean().optional(),
    exam: z.lazy(() => ExamCreateNestedOneWithoutQuestionsInputObjectSchema),
  })
  .strict()

export const ExamQuestionCreateWithoutQuestionInputObjectSchema = Schema
