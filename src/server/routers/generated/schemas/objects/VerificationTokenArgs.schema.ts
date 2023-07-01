/* eslint-disable */
import { z } from 'zod'
import { VerificationTokenSelectObjectSchema } from './VerificationTokenSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.VerificationTokenArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema).optional(),
  })
  .strict()

export const VerificationTokenArgsObjectSchema = Schema
