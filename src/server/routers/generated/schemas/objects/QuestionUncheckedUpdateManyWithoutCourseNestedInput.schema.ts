/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateWithoutCourseInputObjectSchema } from './QuestionCreateWithoutCourseInput.schema'
import { QuestionUncheckedCreateWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateWithoutCourseInput.schema'
import { QuestionCreateOrConnectWithoutCourseInputObjectSchema } from './QuestionCreateOrConnectWithoutCourseInput.schema'
import { QuestionUpsertWithWhereUniqueWithoutCourseInputObjectSchema } from './QuestionUpsertWithWhereUniqueWithoutCourseInput.schema'
import { QuestionCreateManyCourseInputEnvelopeObjectSchema } from './QuestionCreateManyCourseInputEnvelope.schema'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionUpdateWithWhereUniqueWithoutCourseInputObjectSchema } from './QuestionUpdateWithWhereUniqueWithoutCourseInput.schema'
import { QuestionUpdateManyWithWhereWithoutCourseInputObjectSchema } from './QuestionUpdateManyWithWhereWithoutCourseInput.schema'
import { QuestionScalarWhereInputObjectSchema } from './QuestionScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUncheckedUpdateManyWithoutCourseNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => QuestionCreateWithoutCourseInputObjectSchema),
        z.lazy(() => QuestionCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => QuestionUncheckedCreateWithoutCourseInputObjectSchema),
        z
          .lazy(() => QuestionUncheckedCreateWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => QuestionCreateOrConnectWithoutCourseInputObjectSchema),
        z
          .lazy(() => QuestionCreateOrConnectWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(
          () => QuestionUpsertWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => QuestionUpsertWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => QuestionCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => QuestionWhereUniqueInputObjectSchema),
        z.lazy(() => QuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => QuestionWhereUniqueInputObjectSchema),
        z.lazy(() => QuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => QuestionWhereUniqueInputObjectSchema),
        z.lazy(() => QuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => QuestionWhereUniqueInputObjectSchema),
        z.lazy(() => QuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(
          () => QuestionUpdateWithWhereUniqueWithoutCourseInputObjectSchema
        ),
        z
          .lazy(
            () => QuestionUpdateWithWhereUniqueWithoutCourseInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => QuestionUpdateManyWithWhereWithoutCourseInputObjectSchema),
        z
          .lazy(() => QuestionUpdateManyWithWhereWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => QuestionScalarWhereInputObjectSchema),
        z.lazy(() => QuestionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const QuestionUncheckedUpdateManyWithoutCourseNestedInputObjectSchema =
  Schema
