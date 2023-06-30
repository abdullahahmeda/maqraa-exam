/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutCurriculumInputObjectSchema } from './ExamCreateWithoutCurriculumInput.schema'
import { ExamUncheckedCreateWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateWithoutCurriculumInput.schema'
import { ExamCreateOrConnectWithoutCurriculumInputObjectSchema } from './ExamCreateOrConnectWithoutCurriculumInput.schema'
import { ExamUpsertWithWhereUniqueWithoutCurriculumInputObjectSchema } from './ExamUpsertWithWhereUniqueWithoutCurriculumInput.schema'
import { ExamCreateManyCurriculumInputEnvelopeObjectSchema } from './ExamCreateManyCurriculumInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithWhereUniqueWithoutCurriculumInputObjectSchema } from './ExamUpdateWithWhereUniqueWithoutCurriculumInput.schema'
import { ExamUpdateManyWithWhereWithoutCurriculumInputObjectSchema } from './ExamUpdateManyWithWhereWithoutCurriculumInput.schema'
import { ExamScalarWhereInputObjectSchema } from './ExamScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateManyWithoutCurriculumNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema),
        z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema).array(),
        z.lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema),
        z
          .lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => ExamCreateOrConnectWithoutCurriculumInputObjectSchema),
        z
          .lazy(() => ExamCreateOrConnectWithoutCurriculumInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(
          () => ExamUpsertWithWhereUniqueWithoutCurriculumInputObjectSchema
        ),
        z
          .lazy(
            () => ExamUpsertWithWhereUniqueWithoutCurriculumInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamCreateManyCurriculumInputEnvelopeObjectSchema)
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
        z.lazy(
          () => ExamUpdateWithWhereUniqueWithoutCurriculumInputObjectSchema
        ),
        z
          .lazy(
            () => ExamUpdateWithWhereUniqueWithoutCurriculumInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => ExamUpdateManyWithWhereWithoutCurriculumInputObjectSchema),
        z
          .lazy(() => ExamUpdateManyWithWhereWithoutCurriculumInputObjectSchema)
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

export const ExamUpdateManyWithoutCurriculumNestedInputObjectSchema = Schema
