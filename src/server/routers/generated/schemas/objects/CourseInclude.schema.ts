/* eslint-disable */
import { z } from 'zod'
import { TrackSchema } from '../Track.schema'
import { QuestionSchema } from '../Question.schema'
import { ExamSchema } from '../Exam.schema'
import { CycleCourseSchema } from '../CycleCourse.schema'
import { CourseCountOutputTypeArgsObjectSchema } from './CourseCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    curricula: z
      .union([z.boolean(), z.lazy(() => TrackSchema.findMany)])
      .optional(),
    questions: z
      .union([z.boolean(), z.lazy(() => QuestionSchema.findMany)])
      .optional(),
    exams: z.union([z.boolean(), z.lazy(() => ExamSchema.findMany)]).optional(),
    cycles: z
      .union([z.boolean(), z.lazy(() => CycleCourseSchema.findMany)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CourseCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CourseIncludeObjectSchema = Schema
