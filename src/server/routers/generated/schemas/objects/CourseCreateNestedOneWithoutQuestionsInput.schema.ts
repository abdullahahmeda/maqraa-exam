/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutQuestionsInputObjectSchema } from './CourseCreateWithoutQuestionsInput.schema'
import { CourseUncheckedCreateWithoutQuestionsInputObjectSchema } from './CourseUncheckedCreateWithoutQuestionsInput.schema'
import { CourseCreateOrConnectWithoutQuestionsInputObjectSchema } from './CourseCreateOrConnectWithoutQuestionsInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateNestedOneWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutQuestionsInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutQuestionsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutQuestionsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CourseCreateNestedOneWithoutQuestionsInputObjectSchema = Schema
