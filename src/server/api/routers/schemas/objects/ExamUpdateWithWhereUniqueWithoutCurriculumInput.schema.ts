/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutCurriculumInputObjectSchema } from './ExamUpdateWithoutCurriculumInput.schema'
import { ExamUncheckedUpdateWithoutCurriculumInputObjectSchema } from './ExamUncheckedUpdateWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateWithWhereUniqueWithoutCurriculumInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamUpdateWithoutCurriculumInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutCurriculumInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpdateWithWhereUniqueWithoutCurriculumInputObjectSchema =
  Schema
