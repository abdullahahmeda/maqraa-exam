/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutCourseInputObjectSchema } from './CurriculumCreateWithoutCourseInput.schema'
import { CurriculumUncheckedCreateWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateWithoutCourseInput.schema'
import { CurriculumCreateOrConnectWithoutCourseInputObjectSchema } from './CurriculumCreateOrConnectWithoutCourseInput.schema'
import { CurriculumUpsertWithWhereUniqueWithoutCourseInputObjectSchema } from './CurriculumUpsertWithWhereUniqueWithoutCourseInput.schema'
import { CurriculumCreateManyCourseInputEnvelopeObjectSchema } from './CurriculumCreateManyCourseInputEnvelope.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithWhereUniqueWithoutCourseInputObjectSchema } from './CurriculumUpdateWithWhereUniqueWithoutCourseInput.schema'
import { CurriculumUpdateManyWithWhereWithoutCourseInputObjectSchema } from './CurriculumUpdateManyWithWhereWithoutCourseInput.schema'
import { CurriculumScalarWhereInputObjectSchema } from './CurriculumScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpdateManyWithoutCourseNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CurriculumCreateWithoutCourseInputObjectSchema),
        z.lazy(() => CurriculumCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => CurriculumUncheckedCreateWithoutCourseInputObjectSchema),
        z
          .lazy(() => CurriculumUncheckedCreateWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CurriculumCreateOrConnectWithoutCourseInputObjectSchema),
        z
          .lazy(() => CurriculumCreateOrConnectWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(
          () => CurriculumUpsertWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpsertWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CurriculumCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(
          () => CurriculumUpdateWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpdateWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => CurriculumUpdateManyWithWhereWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpdateManyWithWhereWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => CurriculumScalarWhereInputObjectSchema),
        z.lazy(() => CurriculumScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CurriculumUpdateManyWithoutCourseNestedInputObjectSchema = Schema
