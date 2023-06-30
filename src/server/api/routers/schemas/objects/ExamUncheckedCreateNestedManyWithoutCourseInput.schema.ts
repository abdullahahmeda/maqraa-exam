/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutCourseInputObjectSchema } from './ExamCreateWithoutCourseInput.schema'
import { ExamUncheckedCreateWithoutCourseInputObjectSchema } from './ExamUncheckedCreateWithoutCourseInput.schema'
import { ExamCreateOrConnectWithoutCourseInputObjectSchema } from './ExamCreateOrConnectWithoutCourseInput.schema'
import { ExamCreateManyCourseInputEnvelopeObjectSchema } from './ExamCreateManyCourseInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUncheckedCreateNestedManyWithoutCourseInput,
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
    createMany: z
      .lazy(() => ExamCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema =
  Schema
