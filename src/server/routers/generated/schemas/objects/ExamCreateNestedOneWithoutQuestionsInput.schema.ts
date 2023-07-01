/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutQuestionsInputObjectSchema } from './ExamCreateWithoutQuestionsInput.schema'
import { ExamUncheckedCreateWithoutQuestionsInputObjectSchema } from './ExamUncheckedCreateWithoutQuestionsInput.schema'
import { ExamCreateOrConnectWithoutQuestionsInputObjectSchema } from './ExamCreateOrConnectWithoutQuestionsInput.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateNestedOneWithoutQuestionsInput,
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
    connect: z.lazy(() => ExamWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const ExamCreateNestedOneWithoutQuestionsInputObjectSchema = Schema
