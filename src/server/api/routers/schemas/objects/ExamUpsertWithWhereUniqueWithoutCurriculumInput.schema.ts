/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutCurriculumInputObjectSchema } from './ExamUpdateWithoutCurriculumInput.schema'
import { ExamUncheckedUpdateWithoutCurriculumInputObjectSchema } from './ExamUncheckedUpdateWithoutCurriculumInput.schema'
import { ExamCreateWithoutCurriculumInputObjectSchema } from './ExamCreateWithoutCurriculumInput.schema'
import { ExamUncheckedCreateWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpsertWithWhereUniqueWithoutCurriculumInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => ExamUpdateWithoutCurriculumInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutCurriculumInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpsertWithWhereUniqueWithoutCurriculumInputObjectSchema =
  Schema
