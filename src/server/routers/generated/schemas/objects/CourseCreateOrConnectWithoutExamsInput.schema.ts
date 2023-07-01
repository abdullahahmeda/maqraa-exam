/* eslint-disable */
import { z } from 'zod'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseCreateWithoutExamsInputObjectSchema } from './CourseCreateWithoutExamsInput.schema'
import { CourseUncheckedCreateWithoutExamsInputObjectSchema } from './CourseUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateOrConnectWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CourseCreateWithoutExamsInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const CourseCreateOrConnectWithoutExamsInputObjectSchema = Schema
