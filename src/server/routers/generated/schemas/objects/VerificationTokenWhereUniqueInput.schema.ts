/* eslint-disable */
import { z } from 'zod'
import { VerificationTokenIdentifierTokenCompoundUniqueInputObjectSchema } from './VerificationTokenIdentifierTokenCompoundUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.VerificationTokenWhereUniqueInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    token: z.string().optional(),
    identifier_token: z
      .lazy(
        () => VerificationTokenIdentifierTokenCompoundUniqueInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const VerificationTokenWhereUniqueInputObjectSchema = Schema
