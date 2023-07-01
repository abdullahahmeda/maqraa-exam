/* eslint-disable */
import { z } from 'zod'
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SettingScalarWhereWithAggregatesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => SettingScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => SettingScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => SettingScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => SettingScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => SettingScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    key: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    value: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict()

export const SettingScalarWhereWithAggregatesInputObjectSchema = Schema
