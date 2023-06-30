/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCountOutputTypeSelect,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    curricula: z.boolean().optional(),
    questions: z.boolean().optional(),
    exams: z.boolean().optional(),
  })
  .strict()

export const CourseCountOutputTypeSelectObjectSchema = Schema
