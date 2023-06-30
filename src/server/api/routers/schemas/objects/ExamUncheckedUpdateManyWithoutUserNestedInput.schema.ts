/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutUserInputObjectSchema } from './ExamCreateWithoutUserInput.schema'
import { ExamUncheckedCreateWithoutUserInputObjectSchema } from './ExamUncheckedCreateWithoutUserInput.schema'
import { ExamCreateOrConnectWithoutUserInputObjectSchema } from './ExamCreateOrConnectWithoutUserInput.schema'
import { ExamUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './ExamUpsertWithWhereUniqueWithoutUserInput.schema'
import { ExamCreateManyUserInputEnvelopeObjectSchema } from './ExamCreateManyUserInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './ExamUpdateWithWhereUniqueWithoutUserInput.schema'
import { ExamUpdateManyWithWhereWithoutUserInputObjectSchema } from './ExamUpdateManyWithWhereWithoutUserInput.schema'
import { ExamScalarWhereInputObjectSchema } from './ExamScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUncheckedUpdateManyWithoutUserNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamCreateWithoutUserInputObjectSchema),
        z.lazy(() => ExamCreateWithoutUserInputObjectSchema).array(),
        z.lazy(() => ExamUncheckedCreateWithoutUserInputObjectSchema),
        z.lazy(() => ExamUncheckedCreateWithoutUserInputObjectSchema).array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => ExamCreateOrConnectWithoutUserInputObjectSchema),
        z.lazy(() => ExamCreateOrConnectWithoutUserInputObjectSchema).array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(() => ExamUpsertWithWhereUniqueWithoutUserInputObjectSchema),
        z
          .lazy(() => ExamUpsertWithWhereUniqueWithoutUserInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamCreateManyUserInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(() => ExamUpdateWithWhereUniqueWithoutUserInputObjectSchema),
        z
          .lazy(() => ExamUpdateWithWhereUniqueWithoutUserInputObjectSchema)
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => ExamUpdateManyWithWhereWithoutUserInputObjectSchema),
        z
          .lazy(() => ExamUpdateManyWithWhereWithoutUserInputObjectSchema)
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => ExamScalarWhereInputObjectSchema),
        z.lazy(() => ExamScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema
