/* eslint-disable */
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamMinAggregateInputType,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.literal(true).optional(),
    difficulty: z.literal(true).optional(),
    userId: z.literal(true).optional(),
    grade: z.literal(true).optional(),
    submittedAt: z.literal(true).optional(),
    createdAt: z.literal(true).optional(),
    courseId: z.literal(true).optional(),
    curriculumId: z.literal(true).optional(),
  })
  .strict()

export const ExamMinAggregateInputObjectSchema = Schema
