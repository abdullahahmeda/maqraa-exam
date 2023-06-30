/* eslint-disable */
import { z } from 'zod'
import { CourseCreateNestedOneWithoutCurriculaInputObjectSchema } from './CourseCreateNestedOneWithoutCurriculaInput.schema'
import { ExamCreateNestedManyWithoutCurriculumInputObjectSchema } from './ExamCreateNestedManyWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumCreateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    fromPage: z.number(),
    toPage: z.number(),
    course: z.lazy(
      () => CourseCreateNestedOneWithoutCurriculaInputObjectSchema
    ),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCurriculumInputObjectSchema)
      .optional(),
  })
  .strict()

export const CurriculumCreateInputObjectSchema = Schema
