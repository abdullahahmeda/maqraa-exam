/* eslint-disable */
import { z } from 'zod'
import { TrackUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './TrackUncheckedCreateNestedManyWithoutCourseInput.schema'
import { QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateNestedManyWithoutCourseInput.schema'
import { ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './ExamUncheckedCreateNestedManyWithoutCourseInput.schema'
import { CycleCourseUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './CycleCourseUncheckedCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedCreateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(() => TrackUncheckedCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    questions: z
      .lazy(
        () => QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema
      )
      .optional(),
    exams: z
      .lazy(() => ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    cycles: z
      .lazy(
        () => CycleCourseUncheckedCreateNestedManyWithoutCourseInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CourseUncheckedCreateInputObjectSchema = Schema
