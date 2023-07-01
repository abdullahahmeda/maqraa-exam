/* eslint-disable */
import { z } from 'zod'
import { ExamArgsObjectSchema } from './ExamArgs.schema'
import { QuestionArgsObjectSchema } from './QuestionArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamQuestionInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    exam: z.union([z.boolean(), z.lazy(() => ExamArgsObjectSchema)]).optional(),
    question: z
      .union([z.boolean(), z.lazy(() => QuestionArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const ExamQuestionIncludeObjectSchema = Schema
