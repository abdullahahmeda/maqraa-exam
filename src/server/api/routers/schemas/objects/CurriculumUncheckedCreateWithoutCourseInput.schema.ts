/* eslint-disable */
import { z } from 'zod'
import { ExamUncheckedCreateNestedManyWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateNestedManyWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUncheckedCreateWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    fromPage: z.number(),
    toPage: z.number(),
    exams: z
      .lazy(
        () => ExamUncheckedCreateNestedManyWithoutCurriculumInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CurriculumUncheckedCreateWithoutCourseInputObjectSchema = Schema
