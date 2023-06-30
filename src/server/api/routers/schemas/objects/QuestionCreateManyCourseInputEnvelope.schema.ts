/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateManyCourseInputObjectSchema } from './QuestionCreateManyCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCreateManyCourseInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => QuestionCreateManyCourseInputObjectSchema),
      z.lazy(() => QuestionCreateManyCourseInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const QuestionCreateManyCourseInputEnvelopeObjectSchema = Schema
