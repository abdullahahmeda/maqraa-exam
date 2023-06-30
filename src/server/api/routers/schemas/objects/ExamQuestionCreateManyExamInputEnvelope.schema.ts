/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateManyExamInputObjectSchema } from './ExamQuestionCreateManyExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateManyExamInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => ExamQuestionCreateManyExamInputObjectSchema),
      z.lazy(() => ExamQuestionCreateManyExamInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const ExamQuestionCreateManyExamInputEnvelopeObjectSchema = Schema
