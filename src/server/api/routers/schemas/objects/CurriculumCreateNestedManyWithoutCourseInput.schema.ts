/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutCourseInputObjectSchema } from './CurriculumCreateWithoutCourseInput.schema'
import { CurriculumUncheckedCreateWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateWithoutCourseInput.schema'
import { CurriculumCreateOrConnectWithoutCourseInputObjectSchema } from './CurriculumCreateOrConnectWithoutCourseInput.schema'
import { CurriculumCreateManyCourseInputEnvelopeObjectSchema } from './CurriculumCreateManyCourseInputEnvelope.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateNestedManyWithoutCourseInput,
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
    createMany: z
      .lazy(() => CurriculumCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CurriculumCreateNestedManyWithoutCourseInputObjectSchema = Schema
