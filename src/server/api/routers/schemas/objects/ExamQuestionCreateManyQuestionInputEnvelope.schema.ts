/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateManyQuestionInputObjectSchema } from './ExamQuestionCreateManyQuestionInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateManyQuestionInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => ExamQuestionCreateManyQuestionInputObjectSchema),
      z.lazy(() => ExamQuestionCreateManyQuestionInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const ExamQuestionCreateManyQuestionInputEnvelopeObjectSchema = Schema
