/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateManyCycleInputObjectSchema } from './CycleCourseCreateManyCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateManyCycleInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => CycleCourseCreateManyCycleInputObjectSchema),
      z.lazy(() => CycleCourseCreateManyCycleInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const CycleCourseCreateManyCycleInputEnvelopeObjectSchema = Schema
