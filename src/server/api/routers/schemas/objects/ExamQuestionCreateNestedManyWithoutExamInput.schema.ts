/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateWithoutExamInputObjectSchema } from './ExamQuestionCreateWithoutExamInput.schema'
import { ExamQuestionUncheckedCreateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutExamInput.schema'
import { ExamQuestionCreateOrConnectWithoutExamInputObjectSchema } from './ExamQuestionCreateOrConnectWithoutExamInput.schema'
import { ExamQuestionCreateManyExamInputEnvelopeObjectSchema } from './ExamQuestionCreateManyExamInputEnvelope.schema'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateNestedManyWithoutExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamQuestionCreateWithoutExamInputObjectSchema),
        z.lazy(() => ExamQuestionCreateWithoutExamInputObjectSchema).array(),
        z.lazy(() => ExamQuestionUncheckedCreateWithoutExamInputObjectSchema),
        z
          .lazy(() => ExamQuestionUncheckedCreateWithoutExamInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => ExamQuestionCreateOrConnectWithoutExamInputObjectSchema),
        z
          .lazy(() => ExamQuestionCreateOrConnectWithoutExamInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamQuestionCreateManyExamInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamQuestionCreateNestedManyWithoutExamInputObjectSchema = Schema
