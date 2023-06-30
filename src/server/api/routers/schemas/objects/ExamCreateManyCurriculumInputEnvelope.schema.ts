/* eslint-disable */
import { z } from 'zod'
import { ExamCreateManyCurriculumInputObjectSchema } from './ExamCreateManyCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateManyCurriculumInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => ExamCreateManyCurriculumInputObjectSchema),
      z.lazy(() => ExamCreateManyCurriculumInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const ExamCreateManyCurriculumInputEnvelopeObjectSchema = Schema
