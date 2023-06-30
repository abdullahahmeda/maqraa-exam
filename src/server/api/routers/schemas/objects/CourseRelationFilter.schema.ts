/* eslint-disable */
import { z } from 'zod'
import { CourseWhereInputObjectSchema } from './CourseWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseRelationFilter, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    is: z
      .lazy(() => CourseWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => CourseWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const CourseRelationFilterObjectSchema = Schema
