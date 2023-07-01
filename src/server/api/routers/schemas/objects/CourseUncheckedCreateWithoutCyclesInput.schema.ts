/* eslint-disable */
import { z } from 'zod'
import { TrackUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './TrackUncheckedCreateNestedManyWithoutCourseInput.schema'
import { QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateNestedManyWithoutCourseInput.schema'
import { ExamUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './ExamUncheckedCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedCreateWithoutCyclesInput,
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
  })
  .strict()

export const CourseUncheckedCreateWithoutCyclesInputObjectSchema = Schema
