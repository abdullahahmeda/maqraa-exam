/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateManyTrackInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    fromPage: z.number(),
    toPage: z.number(),
  })
  .strict()

export const CurriculumCreateManyTrackInputObjectSchema = Schema
