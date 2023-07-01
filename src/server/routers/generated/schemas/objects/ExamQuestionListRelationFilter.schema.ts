/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereInputObjectSchema } from './ExamQuestionWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionListRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    every: z.lazy(() => ExamQuestionWhereInputObjectSchema).optional(),
    some: z.lazy(() => ExamQuestionWhereInputObjectSchema).optional(),
    none: z.lazy(() => ExamQuestionWhereInputObjectSchema).optional(),
  })
  .strict()

export const ExamQuestionListRelationFilterObjectSchema = Schema
