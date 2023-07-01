/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { CourseRelationFilterObjectSchema } from './CourseRelationFilter.schema'
import { CourseWhereInputObjectSchema } from './CourseWhereInput.schema'
import { ExamListRelationFilterObjectSchema } from './ExamListRelationFilter.schema'
import { CurriculumListRelationFilterObjectSchema } from './CurriculumListRelationFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TrackWhereInputObjectSchema),
        z.lazy(() => TrackWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TrackWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TrackWhereInputObjectSchema),
        z.lazy(() => TrackWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    courseId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    course: z
      .union([
        z.lazy(() => CourseRelationFilterObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema),
      ])
      .optional(),
    exams: z.lazy(() => ExamListRelationFilterObjectSchema).optional(),
    curricula: z
      .lazy(() => CurriculumListRelationFilterObjectSchema)
      .optional(),
  })
  .strict()

export const TrackWhereInputObjectSchema = Schema
