/* eslint-disable */
import { z } from 'zod'
import { SortOrderSchema } from '../enums/SortOrder.schema'
import { CycleOrderByWithRelationInputObjectSchema } from './CycleOrderByWithRelationInput.schema'
import { CourseOrderByWithRelationInputObjectSchema } from './CourseOrderByWithRelationInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseOrderByWithRelationInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    courseId: z.lazy(() => SortOrderSchema).optional(),
    cycleId: z.lazy(() => SortOrderSchema).optional(),
    cycle: z.lazy(() => CycleOrderByWithRelationInputObjectSchema).optional(),
    course: z.lazy(() => CourseOrderByWithRelationInputObjectSchema).optional(),
  })
  .strict()

export const CycleCourseOrderByWithRelationInputObjectSchema = Schema
