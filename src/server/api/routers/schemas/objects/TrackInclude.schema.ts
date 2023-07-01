/* eslint-disable */
import { z } from 'zod'
import { CourseArgsObjectSchema } from './CourseArgs.schema'
import { ExamSchema } from '../Exam.schema'
import { CurriculumSchema } from '../Curriculum.schema'
import { TrackCountOutputTypeArgsObjectSchema } from './TrackCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
    exams: z.union([z.boolean(), z.lazy(() => ExamSchema.findMany)]).optional(),
    curricula: z
      .union([z.boolean(), z.lazy(() => CurriculumSchema.findMany)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => TrackCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const TrackIncludeObjectSchema = Schema
