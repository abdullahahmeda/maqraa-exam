/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutExamsInputObjectSchema } from './CourseCreateWithoutExamsInput.schema'
import { CourseUncheckedCreateWithoutExamsInputObjectSchema } from './CourseUncheckedCreateWithoutExamsInput.schema'
import { CourseCreateOrConnectWithoutExamsInputObjectSchema } from './CourseCreateOrConnectWithoutExamsInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateNestedOneWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutExamsInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CourseCreateNestedOneWithoutExamsInputObjectSchema = Schema
