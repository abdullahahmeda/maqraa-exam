/* eslint-disable */
import { z } from 'zod'
import { CourseSelectObjectSchema } from './CourseSelect.schema'
import { CourseIncludeObjectSchema } from './CourseInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => CourseSelectObjectSchema).optional(),
    include: z.lazy(() => CourseIncludeObjectSchema).optional(),
  })
  .strict()

export const CourseArgsObjectSchema = Schema
