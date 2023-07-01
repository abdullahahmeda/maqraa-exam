/* eslint-disable */
import { z } from 'zod'
import { UserArgsObjectSchema } from './UserArgs.schema'
import { CourseArgsObjectSchema } from './CourseArgs.schema'
import { TrackArgsObjectSchema } from './TrackArgs.schema'
import { ExamQuestionSchema } from '../ExamQuestion.schema'
import { ExamCountOutputTypeArgsObjectSchema } from './ExamCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.ExamSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    difficulty: z.boolean().optional(),
    userId: z.boolean().optional(),
    grade: z.boolean().optional(),
    submittedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    courseId: z.boolean().optional(),
    curriculumId: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
    curriculum: z
      .union([z.boolean(), z.lazy(() => TrackArgsObjectSchema)])
      .optional(),
    questions: z
      .union([z.boolean(), z.lazy(() => ExamQuestionSchema.findMany)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => ExamCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const ExamSelectObjectSchema = Schema
