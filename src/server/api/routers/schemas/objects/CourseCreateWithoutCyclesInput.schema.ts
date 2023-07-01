/* eslint-disable */
import { z } from 'zod'
import { TrackCreateNestedManyWithoutCourseInputObjectSchema } from './TrackCreateNestedManyWithoutCourseInput.schema'
import { QuestionCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionCreateNestedManyWithoutCourseInput.schema'
import { ExamCreateNestedManyWithoutCourseInputObjectSchema } from './ExamCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateWithoutCyclesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(() => TrackCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => QuestionCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCourseInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseCreateWithoutCyclesInputObjectSchema = Schema
