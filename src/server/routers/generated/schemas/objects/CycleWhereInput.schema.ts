/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { CycleCourseListRelationFilterObjectSchema } from './CycleCourseListRelationFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CycleWhereInputObjectSchema),
        z.lazy(() => CycleWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CycleWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CycleWhereInputObjectSchema),
        z.lazy(() => CycleWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    courses: z.lazy(() => CycleCourseListRelationFilterObjectSchema).optional(),
  })
  .strict()

export const CycleWhereInputObjectSchema = Schema
