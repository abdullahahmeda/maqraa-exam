/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutUserInputObjectSchema } from './ExamCreateWithoutUserInput.schema'
import { ExamUncheckedCreateWithoutUserInputObjectSchema } from './ExamUncheckedCreateWithoutUserInput.schema'
import { ExamCreateOrConnectWithoutUserInputObjectSchema } from './ExamCreateOrConnectWithoutUserInput.schema'
import { ExamCreateManyUserInputEnvelopeObjectSchema } from './ExamCreateManyUserInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUncheckedCreateNestedManyWithoutUserInput,
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
    createMany: z
      .lazy(() => ExamCreateManyUserInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema
