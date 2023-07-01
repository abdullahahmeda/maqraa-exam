/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateManyCourseInputObjectSchema } from './CycleCourseCreateManyCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateManyCourseInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => CycleCourseCreateManyCourseInputObjectSchema),
      z.lazy(() => CycleCourseCreateManyCourseInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const CycleCourseCreateManyCourseInputEnvelopeObjectSchema = Schema
