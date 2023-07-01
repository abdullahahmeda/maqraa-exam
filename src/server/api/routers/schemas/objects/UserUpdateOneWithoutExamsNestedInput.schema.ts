/* eslint-disable */
import { z } from 'zod'
import { UserCreateWithoutExamsInputObjectSchema } from './UserCreateWithoutExamsInput.schema'
import { UserUncheckedCreateWithoutExamsInputObjectSchema } from './UserUncheckedCreateWithoutExamsInput.schema'
import { UserCreateOrConnectWithoutExamsInputObjectSchema } from './UserCreateOrConnectWithoutExamsInput.schema'
import { UserUpsertWithoutExamsInputObjectSchema } from './UserUpsertWithoutExamsInput.schema'
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'
import { UserUpdateWithoutExamsInputObjectSchema } from './UserUpdateWithoutExamsInput.schema'
import { UserUncheckedUpdateWithoutExamsInputObjectSchema } from './UserUncheckedUpdateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.UserUpdateOneWithoutExamsNestedInput,
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
    upsert: z.lazy(() => UserUpsertWithoutExamsInputObjectSchema).optional(),
    disconnect: z.boolean().optional(),
    delete: z.boolean().optional(),
    connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => UserUpdateWithoutExamsInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutExamsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const UserUpdateOneWithoutExamsNestedInputObjectSchema = Schema
