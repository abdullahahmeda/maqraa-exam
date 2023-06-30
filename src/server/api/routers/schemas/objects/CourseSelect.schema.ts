/* eslint-disable */
import { z } from 'zod'
import { CurriculumSchema } from '../Curriculum.schema'
import { QuestionSchema } from '../Question.schema'
import { ExamSchema } from '../Exam.schema'
import { CourseCountOutputTypeArgsObjectSchema } from './CourseCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    curricula: z
      .union([z.boolean(), z.lazy(() => CurriculumSchema.findMany)])
      .optional(),
    questions: z
      .union([z.boolean(), z.lazy(() => QuestionSchema.findMany)])
      .optional(),
    exams: z.union([z.boolean(), z.lazy(() => ExamSchema.findMany)]).optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CourseCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict()

export const CourseSelectObjectSchema = Schema
