/* eslint-disable */
import { z } from 'zod'
import { IntFilterObjectSchema } from './IntFilter.schema'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { CycleRelationFilterObjectSchema } from './CycleRelationFilter.schema'
import { CycleWhereInputObjectSchema } from './CycleWhereInput.schema'
import { CourseRelationFilterObjectSchema } from './CourseRelationFilter.schema'
import { CourseWhereInputObjectSchema } from './CourseWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CycleCourseWhereInputObjectSchema),
        z.lazy(() => CycleCourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CycleCourseWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CycleCourseWhereInputObjectSchema),
        z.lazy(() => CycleCourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    courseId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    cycleId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    cycle: z
      .union([
        z.lazy(() => CycleRelationFilterObjectSchema),
        z.lazy(() => CycleWhereInputObjectSchema),
      ])
      .optional(),
    course: z
      .union([
        z.lazy(() => CourseRelationFilterObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CycleCourseWhereInputObjectSchema = Schema
