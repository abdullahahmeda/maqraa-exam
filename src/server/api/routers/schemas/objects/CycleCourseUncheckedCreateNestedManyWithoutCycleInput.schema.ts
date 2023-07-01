/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateWithoutCycleInputObjectSchema } from './CycleCourseCreateWithoutCycleInput.schema'
import { CycleCourseUncheckedCreateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCycleInput.schema'
import { CycleCourseCreateOrConnectWithoutCycleInputObjectSchema } from './CycleCourseCreateOrConnectWithoutCycleInput.schema'
import { CycleCourseCreateManyCycleInputEnvelopeObjectSchema } from './CycleCourseCreateManyCycleInputEnvelope.schema'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUncheckedCreateNestedManyWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema),
        z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema).array(),
        z.lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema),
        z
          .lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CycleCourseCreateOrConnectWithoutCycleInputObjectSchema),
        z
          .lazy(() => CycleCourseCreateOrConnectWithoutCycleInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CycleCourseCreateManyCycleInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
        z.lazy(() => CycleCourseWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CycleCourseUncheckedCreateNestedManyWithoutCycleInputObjectSchema =
  Schema
