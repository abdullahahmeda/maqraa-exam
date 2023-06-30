/* eslint-disable */
import { z } from 'zod'
import { UserCreateNestedOneWithoutExamsInputObjectSchema } from './UserCreateNestedOneWithoutExamsInput.schema'
import { CourseCreateNestedOneWithoutExamsInputObjectSchema } from './CourseCreateNestedOneWithoutExamsInput.schema'
import { ExamQuestionCreateNestedManyWithoutExamInputObjectSchema } from './ExamQuestionCreateNestedManyWithoutExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateWithoutCurriculumInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    difficulty: z.string(),
    grade: z.number().optional().nullable(),
    submittedAt: z
      .union([z.date().optional(), z.string().datetime().optional()])
      .nullable(),
    createdAt: z.union([z.date().optional(), z.string().datetime().optional()]),
    user: z.lazy(() => UserCreateNestedOneWithoutExamsInputObjectSchema),
    course: z.lazy(() => CourseCreateNestedOneWithoutExamsInputObjectSchema),
    questions: z
      .lazy(() => ExamQuestionCreateNestedManyWithoutExamInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamCreateWithoutCurriculumInputObjectSchema = Schema
