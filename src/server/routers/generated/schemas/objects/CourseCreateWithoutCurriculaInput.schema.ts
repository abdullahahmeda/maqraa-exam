/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionCreateNestedManyWithoutCourseInput.schema'
import { ExamCreateNestedManyWithoutCourseInputObjectSchema } from './ExamCreateNestedManyWithoutCourseInput.schema'
import { CycleCourseCreateNestedManyWithoutCourseInputObjectSchema } from './CycleCourseCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    questions: z
      .lazy(() => QuestionCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    cycles: z
      .lazy(() => CycleCourseCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseCreateWithoutCurriculaInputObjectSchema = Schema
