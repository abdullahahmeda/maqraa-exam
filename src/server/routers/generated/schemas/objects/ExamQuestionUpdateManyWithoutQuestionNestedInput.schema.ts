/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionCreateWithoutQuestionInputObjectSchema } from './ExamQuestionCreateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutQuestionInput.schema'
import { ExamQuestionCreateOrConnectWithoutQuestionInputObjectSchema } from './ExamQuestionCreateOrConnectWithoutQuestionInput.schema'
import { ExamQuestionUpsertWithWhereUniqueWithoutQuestionInputObjectSchema } from './ExamQuestionUpsertWithWhereUniqueWithoutQuestionInput.schema'
import { ExamQuestionCreateManyQuestionInputEnvelopeObjectSchema } from './ExamQuestionCreateManyQuestionInputEnvelope.schema'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithWhereUniqueWithoutQuestionInputObjectSchema } from './ExamQuestionUpdateWithWhereUniqueWithoutQuestionInput.schema'
import { ExamQuestionUpdateManyWithWhereWithoutQuestionInputObjectSchema } from './ExamQuestionUpdateManyWithWhereWithoutQuestionInput.schema'
import { ExamQuestionScalarWhereInputObjectSchema } from './ExamQuestionScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateManyWithoutQuestionNestedInput,
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
    upsert: z
      .union([
        z.lazy(
          () =>
            ExamQuestionUpsertWithWhereUniqueWithoutQuestionInputObjectSchema
        ),
        z
          .lazy(
            () =>
              ExamQuestionUpsertWithWhereUniqueWithoutQuestionInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamQuestionCreateManyQuestionInputEnvelopeObjectSchema)
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
          () =>
            ExamQuestionUpdateWithWhereUniqueWithoutQuestionInputObjectSchema
        ),
        z
          .lazy(
            () =>
              ExamQuestionUpdateWithWhereUniqueWithoutQuestionInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => ExamQuestionUpdateManyWithWhereWithoutQuestionInputObjectSchema
        ),
        z
          .lazy(
            () =>
              ExamQuestionUpdateManyWithWhereWithoutQuestionInputObjectSchema
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

export const ExamQuestionUpdateManyWithoutQuestionNestedInputObjectSchema =
  Schema
