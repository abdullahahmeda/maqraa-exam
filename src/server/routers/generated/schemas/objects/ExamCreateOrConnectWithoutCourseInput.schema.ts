/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamCreateWithoutCourseInputObjectSchema } from './ExamCreateWithoutCourseInput.schema'
import { ExamUncheckedCreateWithoutCourseInputObjectSchema } from './ExamUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateOrConnectWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamCreateWithoutCourseInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const ExamCreateOrConnectWithoutCourseInputObjectSchema = Schema
