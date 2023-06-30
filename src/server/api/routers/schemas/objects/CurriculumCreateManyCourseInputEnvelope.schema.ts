/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateManyCourseInputObjectSchema } from './CurriculumCreateManyCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateManyCourseInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => CurriculumCreateManyCourseInputObjectSchema),
      z.lazy(() => CurriculumCreateManyCourseInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const CurriculumCreateManyCourseInputEnvelopeObjectSchema = Schema
