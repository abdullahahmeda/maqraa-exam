/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'
import { ExamOrderByWithRelationInputObjectSchema } from './ExamOrderByWithRelationInput.schema'
import { QuestionOrderByWithRelationInputObjectSchema } from './QuestionOrderByWithRelationInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    examId: z.lazy(() => SortOrderSchema).optional(),
    questionId: z.lazy(() => SortOrderSchema).optional(),
    answer: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    isCorrect: z.lazy(() => SortOrderSchema).optional(),
    exam: z.lazy(() => ExamOrderByWithRelationInputObjectSchema).optional(),
    question: z
      .lazy(() => QuestionOrderByWithRelationInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamQuestionOrderByWithRelationInputObjectSchema = Schema
