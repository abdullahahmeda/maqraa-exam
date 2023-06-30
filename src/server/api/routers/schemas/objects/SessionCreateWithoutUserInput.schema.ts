/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SessionCreateWithoutUserInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    sessionToken: z.string(),
    expires: z.union([z.date(), z.string().datetime()]),
  })
  .strict()

export const SessionCreateWithoutUserInputObjectSchema = Schema
