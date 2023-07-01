/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutCyclesInputObjectSchema } from './CourseCreateWithoutCyclesInput.schema'
import { CourseUncheckedCreateWithoutCyclesInputObjectSchema } from './CourseUncheckedCreateWithoutCyclesInput.schema'
import { CourseCreateOrConnectWithoutCyclesInputObjectSchema } from './CourseCreateOrConnectWithoutCyclesInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateNestedOneWithoutCyclesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutCyclesInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutCyclesInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutCyclesInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CourseCreateNestedOneWithoutCyclesInputObjectSchema = Schema
