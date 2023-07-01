/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'
import { UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'
import { CourseOrderByWithRelationInputObjectSchema } from './CourseOrderByWithRelationInput.schema'
import { TrackOrderByWithRelationInputObjectSchema } from './TrackOrderByWithRelationInput.schema'
import { ExamQuestionOrderByRelationAggregateInputObjectSchema } from './ExamQuestionOrderByRelationAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    difficulty: z.lazy(() => SortOrderSchema).optional(),
    userId: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    grade: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    submittedAt: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    curriculumId: z.lazy(() => SortOrderSchema).optional(),
    user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
    course: z.lazy(() => CourseOrderByWithRelationInputObjectSchema).optional(),
    curriculum: z
      .lazy(() => TrackOrderByWithRelationInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => ExamQuestionOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamOrderByWithRelationInputObjectSchema = Schema
