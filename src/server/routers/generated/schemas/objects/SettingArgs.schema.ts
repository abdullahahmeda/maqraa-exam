/* eslint-disable */
import { z } from 'zod'
import { SettingSelectObjectSchema } from './SettingSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.SettingArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => SettingSelectObjectSchema).optional(),
  })
  .strict()

export const SettingArgsObjectSchema = Schema
