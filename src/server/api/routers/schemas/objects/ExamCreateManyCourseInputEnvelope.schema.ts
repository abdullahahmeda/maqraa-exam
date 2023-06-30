/* eslint-disable */
import { z } from 'zod'
import { ExamCreateManyCourseInputObjectSchema } from './ExamCreateManyCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateManyCourseInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => ExamCreateManyCourseInputObjectSchema),
      z.lazy(() => ExamCreateManyCourseInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const ExamCreateManyCourseInputEnvelopeObjectSchema = Schema
