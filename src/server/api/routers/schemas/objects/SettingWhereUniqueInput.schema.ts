/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SettingWhereUniqueInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    key: z.string().optional(),
  })
  .strict()

export const SettingWhereUniqueInputObjectSchema = Schema
