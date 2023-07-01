/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutCourseInputObjectSchema } from './ExamUpdateWithoutCourseInput.schema'
import { ExamUncheckedUpdateWithoutCourseInputObjectSchema } from './ExamUncheckedUpdateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpdateWithWhereUniqueWithoutCourseInputObjectSchema = Schema
