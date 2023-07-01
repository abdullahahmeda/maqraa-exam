/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateManyTrackInputObjectSchema } from './CurriculumCreateManyTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateManyTrackInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => CurriculumCreateManyTrackInputObjectSchema),
      z.lazy(() => CurriculumCreateManyTrackInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const CurriculumCreateManyTrackInputEnvelopeObjectSchema = Schema
