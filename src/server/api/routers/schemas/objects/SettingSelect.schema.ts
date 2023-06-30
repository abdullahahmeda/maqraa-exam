/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.SettingSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    key: z.boolean().optional(),
    value: z.boolean().optional(),
  })
  .strict()

export const SettingSelectObjectSchema = Schema
