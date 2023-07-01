/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateWithoutExamInputObjectSchema } from './ExamQuestionCreateWithoutExamInput.schema'
import { ExamQuestionUncheckedCreateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutExamInput.schema'
import { ExamQuestionCreateOrConnectWithoutExamInputObjectSchema } from './ExamQuestionCreateOrConnectWithoutExamInput.schema'
import { ExamQuestionUpsertWithWhereUniqueWithoutExamInputObjectSchema } from './ExamQuestionUpsertWithWhereUniqueWithoutExamInput.schema'
import { ExamQuestionCreateManyExamInputEnvelopeObjectSchema } from './ExamQuestionCreateManyExamInputEnvelope.schema'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithWhereUniqueWithoutExamInputObjectSchema } from './ExamQuestionUpdateWithWhereUniqueWithoutExamInput.schema'
import { ExamQuestionUpdateManyWithWhereWithoutExamInputObjectSchema } from './ExamQuestionUpdateManyWithWhereWithoutExamInput.schema'
import { ExamQuestionScalarWhereInputObjectSchema } from './ExamQuestionScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateManyWithoutExamNestedInput,
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
    upsert: z
      .union([
        z.lazy(
          () => ExamQuestionUpsertWithWhereUniqueWithoutExamInputObjectSchema
        ),
        z
          .lazy(
            () => ExamQuestionUpsertWithWhereUniqueWithoutExamInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamQuestionCreateManyExamInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
        z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(
          () => ExamQuestionUpdateWithWhereUniqueWithoutExamInputObjectSchema
        ),
        z
          .lazy(
            () => ExamQuestionUpdateWithWhereUniqueWithoutExamInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => ExamQuestionUpdateManyWithWhereWithoutExamInputObjectSchema
        ),
        z
          .lazy(
            () => ExamQuestionUpdateManyWithWhereWithoutExamInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => ExamQuestionScalarWhereInputObjectSchema),
        z.lazy(() => ExamQuestionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamQuestionUpdateManyWithoutExamNestedInputObjectSchema = Schema
