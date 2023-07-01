/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserCountOutputTypeSelect,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    accounts: z.boolean().optional(),
    sessions: z.boolean().optional(),
    exams: z.boolean().optional(),
  })
  .strict()

export const UserCountOutputTypeSelectObjectSchema = Schema
