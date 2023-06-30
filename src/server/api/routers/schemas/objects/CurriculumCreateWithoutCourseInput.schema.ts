/* eslint-disable */
import { z } from 'zod'
import { ExamCreateNestedManyWithoutCurriculumInputObjectSchema } from './ExamCreateNestedManyWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    fromPage: z.number(),
    toPage: z.number(),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCurriculumInputObjectSchema)
      .optional(),
  })
  .strict()

export const CurriculumCreateWithoutCourseInputObjectSchema = Schema
