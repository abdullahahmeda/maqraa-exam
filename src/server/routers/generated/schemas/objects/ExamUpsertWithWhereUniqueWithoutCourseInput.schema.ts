/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutCourseInputObjectSchema } from './ExamUpdateWithoutCourseInput.schema'
import { ExamUncheckedUpdateWithoutCourseInputObjectSchema } from './ExamUncheckedUpdateWithoutCourseInput.schema'
import { ExamCreateWithoutCourseInputObjectSchema } from './ExamCreateWithoutCourseInput.schema'
import { ExamUncheckedCreateWithoutCourseInputObjectSchema } from './ExamUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpsertWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => ExamUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamCreateWithoutCourseInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpsertWithWhereUniqueWithoutCourseInputObjectSchema = Schema
