/* eslint-disable */
import { z } from 'zod'
import { AccountSchema } from '../Account.schema'
import { SessionSchema } from '../Session.schema'
import { ExamSchema } from '../Exam.schema'
import { UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.UserInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    accounts: z
      .union([z.boolean(), z.lazy(() => AccountSchema.findMany)])
      .optional(),
    sessions: z
      .union([z.boolean(), z.lazy(() => SessionSchema.findMany)])
      .optional(),
    exams: z.union([z.boolean(), z.lazy(() => ExamSchema.findMany)]).optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const UserIncludeObjectSchema = Schema
