/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { IntFilterObjectSchema } from './IntFilter.schema'
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionScalarWhereInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => QuestionScalarWhereInputObjectSchema),
        z.lazy(() => QuestionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => QuestionScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => QuestionScalarWhereInputObjectSchema),
        z.lazy(() => QuestionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    number: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    pageNumber: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    partNumber: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    hadithNumber: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    text: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    type: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    style: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    difficulty: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    option1: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    option2: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    option3: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    option4: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    textForTrue: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    textForFalse: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    answer: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    courseId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict()

export const QuestionScalarWhereInputObjectSchema = Schema
