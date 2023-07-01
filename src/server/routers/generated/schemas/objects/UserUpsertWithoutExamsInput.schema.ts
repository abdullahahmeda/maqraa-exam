/* eslint-disable */
import { z } from 'zod'
import { UserUpdateWithoutExamsInputObjectSchema } from './UserUpdateWithoutExamsInput.schema'
import { UserUncheckedUpdateWithoutExamsInputObjectSchema } from './UserUncheckedUpdateWithoutExamsInput.schema'
import { UserCreateWithoutExamsInputObjectSchema } from './UserCreateWithoutExamsInput.schema'
import { UserUncheckedCreateWithoutExamsInputObjectSchema } from './UserUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserUpsertWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => UserUpdateWithoutExamsInputObjectSchema),
      z.lazy(() => UserUncheckedUpdateWithoutExamsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => UserCreateWithoutExamsInputObjectSchema),
      z.lazy(() => UserUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const UserUpsertWithoutExamsInputObjectSchema = Schema
