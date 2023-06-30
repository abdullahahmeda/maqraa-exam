/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateNestedManyWithoutCourseInputObjectSchema } from './CurriculumCreateNestedManyWithoutCourseInput.schema'
import { QuestionCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(() => CurriculumCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => QuestionCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseCreateWithoutExamsInputObjectSchema = Schema
