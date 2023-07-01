/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutQuestionsInputObjectSchema } from './ExamCreateWithoutQuestionsInput.schema'
import { ExamUncheckedCreateWithoutQuestionsInputObjectSchema } from './ExamUncheckedCreateWithoutQuestionsInput.schema'
import { ExamCreateOrConnectWithoutQuestionsInputObjectSchema } from './ExamCreateOrConnectWithoutQuestionsInput.schema'
import { ExamUpsertWithoutQuestionsInputObjectSchema } from './ExamUpsertWithoutQuestionsInput.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutQuestionsInputObjectSchema } from './ExamUpdateWithoutQuestionsInput.schema'
import { ExamUncheckedUpdateWithoutQuestionsInputObjectSchema } from './ExamUncheckedUpdateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateOneRequiredWithoutQuestionsNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamCreateWithoutQuestionsInputObjectSchema),
        z.lazy(() => ExamUncheckedCreateWithoutQuestionsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => ExamCreateOrConnectWithoutQuestionsInputObjectSchema)
      .optional(),
    upsert: z
      .lazy(() => ExamUpsertWithoutQuestionsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => ExamWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => ExamUpdateWithoutQuestionsInputObjectSchema),
        z.lazy(() => ExamUncheckedUpdateWithoutQuestionsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const ExamUpdateOneRequiredWithoutQuestionsNestedInputObjectSchema =
  Schema
