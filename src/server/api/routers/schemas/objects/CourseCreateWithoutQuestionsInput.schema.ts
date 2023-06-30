/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateNestedManyWithoutCourseInputObjectSchema } from './CurriculumCreateNestedManyWithoutCourseInput.schema'
import { ExamCreateNestedManyWithoutCourseInputObjectSchema } from './ExamCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(() => CurriculumCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseCreateWithoutQuestionsInputObjectSchema = Schema
