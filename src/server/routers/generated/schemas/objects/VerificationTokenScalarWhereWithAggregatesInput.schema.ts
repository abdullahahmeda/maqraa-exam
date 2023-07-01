/* eslint-disable */
import { z } from 'zod'
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.VerificationTokenScalarWhereWithAggregatesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    AND: z
      .union([
        z.lazy(
          () => VerificationTokenScalarWhereWithAggregatesInputObjectSchema
        ),
        z
          .lazy(
            () => VerificationTokenScalarWhereWithAggregatesInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => VerificationTokenScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(
          () => VerificationTokenScalarWhereWithAggregatesInputObjectSchema
        ),
        z
          .lazy(
            () => VerificationTokenScalarWhereWithAggregatesInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    identifier: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    token: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    expires: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.union([z.date(), z.string().datetime().optional()]),
      ])
      .optional(),
  })
  .strict()

export const VerificationTokenScalarWhereWithAggregatesInputObjectSchema =
  Schema
