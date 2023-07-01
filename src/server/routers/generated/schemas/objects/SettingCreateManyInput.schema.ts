/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.SettingCreateManyInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    key: z.string(),
    value: z.string(),
  })
  .strict()

export const SettingCreateManyInputObjectSchema = Schema
