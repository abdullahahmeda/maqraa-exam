/* eslint-disable */
import { z } from 'zod'
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema'
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema'
import { ExamUpdateOneRequiredWithoutQuestionsNestedInputObjectSchema } from './ExamUpdateOneRequiredWithoutQuestionsNestedInput.schema'
import { QuestionUpdateOneRequiredWithoutExamsNestedInputObjectSchema } from './QuestionUpdateOneRequiredWithoutExamsNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    answer: z
      .union([
        z.string(),
        z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional()
      .nullable(),
    isCorrect: z
      .union([
        z.boolean(),
        z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    exam: z
      .lazy(() => ExamUpdateOneRequiredWithoutQuestionsNestedInputObjectSchema)
      .optional(),
    question: z
      .lazy(() => QuestionUpdateOneRequiredWithoutExamsNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamQuestionUpdateInputObjectSchema = Schema
