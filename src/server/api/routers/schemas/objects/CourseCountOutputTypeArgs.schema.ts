/* eslint-disable */
import { z } from 'zod'
import { CourseCountOutputTypeSelectObjectSchema } from './CourseCountOutputTypeSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCountOutputTypeArgs,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    select: z.lazy(() => CourseCountOutputTypeSelectObjectSchema).optional(),
  })
  .strict()

export const CourseCountOutputTypeArgsObjectSchema = Schema
