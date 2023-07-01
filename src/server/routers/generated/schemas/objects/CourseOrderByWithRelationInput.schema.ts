/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { TrackOrderByRelationAggregateInputObjectSchema } from './TrackOrderByRelationAggregateInput.schema'
import { QuestionOrderByRelationAggregateInputObjectSchema } from './QuestionOrderByRelationAggregateInput.schema'
import { ExamOrderByRelationAggregateInputObjectSchema } from './ExamOrderByRelationAggregateInput.schema'
import { CycleCourseOrderByRelationAggregateInputObjectSchema } from './CycleCourseOrderByRelationAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    curricula: z
      .lazy(() => TrackOrderByRelationAggregateInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => QuestionOrderByRelationAggregateInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamOrderByRelationAggregateInputObjectSchema)
      .optional(),
    cycles: z
      .lazy(() => CycleCourseOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseOrderByWithRelationInputObjectSchema = Schema
