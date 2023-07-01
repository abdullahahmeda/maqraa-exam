/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.SettingWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => SettingWhereInputObjectSchema),
        z.lazy(() => SettingWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => SettingWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => SettingWhereInputObjectSchema),
        z.lazy(() => SettingWhereInputObjectSchema).array(),
      ])
      .optional(),
    key: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    value: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict()

export const SettingWhereInputObjectSchema = Schema
