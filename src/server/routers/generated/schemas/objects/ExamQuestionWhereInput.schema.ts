/* eslint-disable */
import { z } from 'zod'
import { IntFilterObjectSchema } from './IntFilter.schema'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'
import { BoolFilterObjectSchema } from './BoolFilter.schema'
import { ExamRelationFilterObjectSchema } from './ExamRelationFilter.schema'
import { ExamWhereInputObjectSchema } from './ExamWhereInput.schema'
import { QuestionRelationFilterObjectSchema } from './QuestionRelationFilter.schema'
import { QuestionWhereInputObjectSchema } from './QuestionWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamQuestionWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ExamQuestionWhereInputObjectSchema),
        z.lazy(() => ExamQuestionWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ExamQuestionWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ExamQuestionWhereInputObjectSchema),
        z.lazy(() => ExamQuestionWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    examId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    questionId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    answer: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    isCorrect: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    exam: z
      .union([
        z.lazy(() => ExamRelationFilterObjectSchema),
        z.lazy(() => ExamWhereInputObjectSchema),
      ])
      .optional(),
    question: z
      .union([
        z.lazy(() => QuestionRelationFilterObjectSchema),
        z.lazy(() => QuestionWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const ExamQuestionWhereInputObjectSchema = Schema
