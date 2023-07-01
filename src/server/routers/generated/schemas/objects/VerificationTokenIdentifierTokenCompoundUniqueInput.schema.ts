/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    identifier: z.string(),
    token: z.string(),
  })
  .strict()

export const VerificationTokenIdentifierTokenCompoundUniqueInputObjectSchema =
  Schema
