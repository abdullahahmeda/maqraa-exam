/* eslint-disable */
import { z } from 'zod'
import { CurriculumUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateNestedManyWithoutCourseInput.schema'
import { ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './ExamUncheckedCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedCreateWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(
        () => CurriculumUncheckedCreateNestedManyWithoutCourseInputObjectSchema
      )
      .optional(),
    exams: z
      .lazy(() => ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseUncheckedCreateWithoutQuestionsInputObjectSchema = Schema
