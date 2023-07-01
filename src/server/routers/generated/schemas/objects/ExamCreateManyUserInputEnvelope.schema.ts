/* eslint-disable */
import { z } from 'zod'
import { ExamCreateManyUserInputObjectSchema } from './ExamCreateManyUserInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateManyUserInputEnvelope,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    data: z.union([
      z.lazy(() => ExamCreateManyUserInputObjectSchema),
      z.lazy(() => ExamCreateManyUserInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict()

export const ExamCreateManyUserInputEnvelopeObjectSchema = Schema
