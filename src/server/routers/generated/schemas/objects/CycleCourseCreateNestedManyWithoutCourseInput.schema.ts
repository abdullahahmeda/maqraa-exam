/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateWithoutCourseInputObjectSchema } from './CycleCourseCreateWithoutCourseInput.schema'
import { CycleCourseUncheckedCreateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCourseInput.schema'
import { CycleCourseCreateOrConnectWithoutCourseInputObjectSchema } from './CycleCourseCreateOrConnectWithoutCourseInput.schema'
import { CycleCourseCreateManyCourseInputEnvelopeObjectSchema } from './CycleCourseCreateManyCourseInputEnvelope.schema'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateNestedManyWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema),
        z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema).array(),
        z.lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema),
        z
          .lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CycleCourseCreateOrConnectWithoutCourseInputObjectSchema),
        z
          .lazy(() => CycleCourseCreateOrConnectWithoutCourseInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CycleCourseCreateManyCourseInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CycleCourseCreateNestedManyWithoutCourseInputObjectSchema = Schema
