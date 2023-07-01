/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutCourseInputObjectSchema } from './ExamCreateWithoutCourseInput.schema'
import { ExamUncheckedCreateWithoutCourseInputObjectSchema } from './ExamUncheckedCreateWithoutCourseInput.schema'
import { ExamCreateOrConnectWithoutCourseInputObjectSchema } from './ExamCreateOrConnectWithoutCourseInput.schema'
import { ExamUpsertWithWhereUniqueWithoutCourseInputObjectSchema } from './ExamUpsertWithWhereUniqueWithoutCourseInput.schema'
import { ExamCreateManyCourseInputEnvelopeObjectSchema } from './ExamCreateManyCourseInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithWhereUniqueWithoutCourseInputObjectSchema } from './ExamUpdateWithWhereUniqueWithoutCourseInput.schema'
import { ExamUpdateManyWithWhereWithoutCourseInputObjectSchema } from './ExamUpdateManyWithWhereWithoutCourseInput.schema'
import { ExamScalarWhereInputObjectSchema } from './ExamScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateManyWithoutCourseNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamCreateWithoutCourseInputObjectSchema),
        z.lazy(() => ExamCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => ExamUncheckedCreateWithoutCourseInputObjectSchema),
        z.lazy(() => ExamUncheckedCreateWithoutCourseInputObjectSchema).array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => ExamCreateOrConnectWithoutCourseInputObjectSchema),
        z.lazy(() => ExamCreateOrConnectWithoutCourseInputObjectSchema).array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(() => ExamUpsertWithWhereUniqueWithoutCourseInputObjectSchema),
        z
          .lazy(() => ExamUpsertWithWhereUniqueWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamCreateManyCourseInputEnvelopeObjectSchema)
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
        z.lazy(() => ExamUpdateWithWhereUniqueWithoutCourseInputObjectSchema),
        z
          .lazy(() => ExamUpdateWithWhereUniqueWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => ExamUpdateManyWithWhereWithoutCourseInputObjectSchema),
        z
          .lazy(() => ExamUpdateManyWithWhereWithoutCourseInputObjectSchema)
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

export const ExamUpdateManyWithoutCourseNestedInputObjectSchema = Schema
