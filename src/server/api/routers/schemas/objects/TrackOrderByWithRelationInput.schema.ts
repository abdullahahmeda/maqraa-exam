/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CourseOrderByWithRelationInputObjectSchema } from './CourseOrderByWithRelationInput.schema'
import { ExamOrderByRelationAggregateInputObjectSchema } from './ExamOrderByRelationAggregateInput.schema'
import { CurriculumOrderByRelationAggregateInputObjectSchema } from './CurriculumOrderByRelationAggregateInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    course: z.lazy(() => CourseOrderByWithRelationInputObjectSchema).optional(),
    exams: z
      .lazy(() => ExamOrderByRelationAggregateInputObjectSchema)
      .optional(),
    curricula: z
      .lazy(() => CurriculumOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict()

export const TrackOrderByWithRelationInputObjectSchema = Schema
