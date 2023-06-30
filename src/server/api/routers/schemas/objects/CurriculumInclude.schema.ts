/* eslint-disable */
import { z } from 'zod'
import { CourseArgsObjectSchema } from './CourseArgs.schema'
import { ExamSchema } from '../Exam.schema'
import { CurriculumCountOutputTypeArgsObjectSchema } from './CurriculumCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
    exams: z.union([z.boolean(), z.lazy(() => ExamSchema.findMany)]).optional(),
    _count: z
      .union([
        z.boolean(),
        z.lazy(() => CurriculumCountOutputTypeArgsObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CurriculumIncludeObjectSchema = Schema
