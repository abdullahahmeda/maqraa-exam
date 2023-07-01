/* eslint-disable */
import { z } from 'zod'
import { SessionCreateNestedManyWithoutUserInputObjectSchema } from './SessionCreateNestedManyWithoutUserInput.schema'
import { ExamCreateNestedManyWithoutUserInputObjectSchema } from './ExamCreateNestedManyWithoutUserInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserCreateWithoutAccountsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z
      .union([z.date().optional(), z.string().datetime().optional()])
      .nullable(),
    password: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
    sessions: z
      .lazy(() => SessionCreateNestedManyWithoutUserInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutUserInputObjectSchema)
      .optional(),
  })
  .strict()

export const UserCreateWithoutAccountsInputObjectSchema = Schema
