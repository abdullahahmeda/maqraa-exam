/* eslint-disable */
import { z } from 'zod'
import { UserCreateWithoutExamsInputObjectSchema } from './UserCreateWithoutExamsInput.schema'
import { UserUncheckedCreateWithoutExamsInputObjectSchema } from './UserUncheckedCreateWithoutExamsInput.schema'
import { UserCreateOrConnectWithoutExamsInputObjectSchema } from './UserCreateOrConnectWithoutExamsInput.schema'
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserCreateNestedOneWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => UserCreateWithoutExamsInputObjectSchema),
        z.lazy(() => UserUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => UserCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const UserCreateNestedOneWithoutExamsInputObjectSchema = Schema
