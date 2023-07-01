/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { TrackListRelationFilterObjectSchema } from './TrackListRelationFilter.schema'
import { QuestionListRelationFilterObjectSchema } from './QuestionListRelationFilter.schema'
import { ExamListRelationFilterObjectSchema } from './ExamListRelationFilter.schema'
import { CycleCourseListRelationFilterObjectSchema } from './CycleCourseListRelationFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CourseWhereInputObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CourseWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CourseWhereInputObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    curricula: z.lazy(() => TrackListRelationFilterObjectSchema).optional(),
    questions: z.lazy(() => QuestionListRelationFilterObjectSchema).optional(),
    exams: z.lazy(() => ExamListRelationFilterObjectSchema).optional(),
    cycles: z.lazy(() => CycleCourseListRelationFilterObjectSchema).optional(),
  })
  .strict()

export const CourseWhereInputObjectSchema = Schema
