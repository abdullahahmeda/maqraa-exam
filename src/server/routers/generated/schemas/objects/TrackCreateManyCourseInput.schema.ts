/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateManyCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
  })
  .strict()

export const TrackCreateManyCourseInputObjectSchema = Schema
