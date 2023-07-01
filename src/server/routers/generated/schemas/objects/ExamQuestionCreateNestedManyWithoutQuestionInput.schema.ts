/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateWithoutQuestionInputObjectSchema } from './ExamQuestionCreateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutQuestionInput.schema'
import { ExamQuestionCreateOrConnectWithoutQuestionInputObjectSchema } from './ExamQuestionCreateOrConnectWithoutQuestionInput.schema'
import { ExamQuestionCreateManyQuestionInputEnvelopeObjectSchema } from './ExamQuestionCreateManyQuestionInputEnvelope.schema'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateNestedManyWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamQuestionCreateWithoutQuestionInputObjectSchema),
        z
          .lazy(() => ExamQuestionCreateWithoutQuestionInputObjectSchema)
          .array(),
        z.lazy(
          () => ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema
        ),
        z
          .lazy(
            () => ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(
          () => ExamQuestionCreateOrConnectWithoutQuestionInputObjectSchema
        ),
        z
          .lazy(
            () => ExamQuestionCreateOrConnectWithoutQuestionInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamQuestionCreateManyQuestionInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamQuestionCreateNestedManyWithoutQuestionInputObjectSchema =
  Schema
