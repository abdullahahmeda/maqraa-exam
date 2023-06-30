/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionSelectObjectSchema } from './ExamQuestionSelect.schema'
import { ExamQuestionIncludeObjectSchema } from './ExamQuestionInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamQuestionArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema).optional(),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema).optional(),
  })
  .strict()

export const ExamQuestionArgsObjectSchema = Schema
