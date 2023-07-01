/* eslint-disable */
import { z } from 'zod'
import { CourseArgsObjectSchema } from './CourseArgs.schema'
import { ExamQuestionSchema } from '../ExamQuestion.schema'
import { QuestionCountOutputTypeArgsObjectSchema } from './QuestionCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.QuestionInclude, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    course: z
      .union([z.boolean(), z.lazy(() => CourseArgsObjectSchema)])
      .optional(),
    exams: z
      .union([z.boolean(), z.lazy(() => ExamQuestionSchema.findMany)])
      .optional(),
    _count: z
      .union([
        z.boolean(),
        z.lazy(() => QuestionCountOutputTypeArgsObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const QuestionIncludeObjectSchema = Schema
