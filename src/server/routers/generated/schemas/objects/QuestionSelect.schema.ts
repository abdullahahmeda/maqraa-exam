/* eslint-disable */
import { z } from 'zod'
import { CourseArgsObjectSchema } from './CourseArgs.schema'
import { ExamQuestionSchema } from '../ExamQuestion.schema'
import { QuestionCountOutputTypeArgsObjectSchema } from './QuestionCountOutputTypeArgs.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.QuestionSelect, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.boolean().optional(),
    number: z.boolean().optional(),
    pageNumber: z.boolean().optional(),
    partNumber: z.boolean().optional(),
    hadithNumber: z.boolean().optional(),
    text: z.boolean().optional(),
    type: z.boolean().optional(),
    style: z.boolean().optional(),
    difficulty: z.boolean().optional(),
    option1: z.boolean().optional(),
    option2: z.boolean().optional(),
    option3: z.boolean().optional(),
    option4: z.boolean().optional(),
    textForTrue: z.boolean().optional(),
    textForFalse: z.boolean().optional(),
    answer: z.boolean().optional(),
    courseId: z.boolean().optional(),
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

export const QuestionSelectObjectSchema = Schema
