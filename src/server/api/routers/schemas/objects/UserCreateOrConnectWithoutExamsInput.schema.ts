/* eslint-disable */
import { z } from 'zod'
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'
import { UserCreateWithoutExamsInputObjectSchema } from './UserCreateWithoutExamsInput.schema'
import { UserUncheckedCreateWithoutExamsInputObjectSchema } from './UserUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserCreateOrConnectWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => UserWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => UserCreateWithoutExamsInputObjectSchema),
      z.lazy(() => UserUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const UserCreateOrConnectWithoutExamsInputObjectSchema = Schema
