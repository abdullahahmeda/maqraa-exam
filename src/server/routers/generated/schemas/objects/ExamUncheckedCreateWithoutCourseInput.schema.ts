/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionUncheckedCreateNestedManyWithoutExamInputObjectSchema } from './ExamQuestionUncheckedCreateNestedManyWithoutExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUncheckedCreateWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    difficulty: z.string(),
    userId: z.string().optional().nullable(),
    grade: z.number().optional().nullable(),
    submittedAt: z
      .union([z.date().optional(), z.string().datetime().optional()])
      .nullable(),
    createdAt: z.union([z.date().optional(), z.string().datetime().optional()]),
    curriculumId: z.string(),
    questions: z
      .lazy(
        () => ExamQuestionUncheckedCreateNestedManyWithoutExamInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const ExamUncheckedCreateWithoutCourseInputObjectSchema = Schema
