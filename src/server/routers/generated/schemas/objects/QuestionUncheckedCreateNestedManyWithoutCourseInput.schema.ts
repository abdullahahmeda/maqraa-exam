/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateWithoutCourseInputObjectSchema } from './QuestionCreateWithoutCourseInput.schema'
import { QuestionUncheckedCreateWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateWithoutCourseInput.schema'
import { QuestionCreateOrConnectWithoutCourseInputObjectSchema } from './QuestionCreateOrConnectWithoutCourseInput.schema'
import { QuestionCreateManyCourseInputEnvelopeObjectSchema } from './QuestionCreateManyCourseInputEnvelope.schema'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUncheckedCreateNestedManyWithoutCourseInput,
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
    createMany: z
      .lazy(() => QuestionCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => QuestionWhereUniqueInputObjectSchema),
        z.lazy(() => QuestionWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema =
  Schema
