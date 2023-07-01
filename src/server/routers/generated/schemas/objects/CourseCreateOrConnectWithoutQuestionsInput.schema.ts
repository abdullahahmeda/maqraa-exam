/* eslint-disable */
import { z } from 'zod'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseCreateWithoutQuestionsInputObjectSchema } from './CourseCreateWithoutQuestionsInput.schema'
import { CourseUncheckedCreateWithoutQuestionsInputObjectSchema } from './CourseUncheckedCreateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateOrConnectWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CourseCreateWithoutQuestionsInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutQuestionsInputObjectSchema),
    ]),
  })
  .strict()

export const CourseCreateOrConnectWithoutQuestionsInputObjectSchema = Schema
