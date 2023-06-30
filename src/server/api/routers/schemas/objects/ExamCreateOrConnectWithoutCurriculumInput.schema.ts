/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamCreateWithoutCurriculumInputObjectSchema } from './ExamCreateWithoutCurriculumInput.schema'
import { ExamUncheckedCreateWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateOrConnectWithoutCurriculumInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema),
    ]),
  })
  .strict()

export const ExamCreateOrConnectWithoutCurriculumInputObjectSchema = Schema
