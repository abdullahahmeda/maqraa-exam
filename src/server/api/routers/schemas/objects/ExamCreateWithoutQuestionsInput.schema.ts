/* eslint-disable */
import { z } from 'zod'
import { UserCreateNestedOneWithoutExamsInputObjectSchema } from './UserCreateNestedOneWithoutExamsInput.schema'
import { CourseCreateNestedOneWithoutExamsInputObjectSchema } from './CourseCreateNestedOneWithoutExamsInput.schema'
import { CurriculumCreateNestedOneWithoutExamsInputObjectSchema } from './CurriculumCreateNestedOneWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateWithoutQuestionsInput,
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
    curriculum: z.lazy(
      () => CurriculumCreateNestedOneWithoutExamsInputObjectSchema
    ),
  })
  .strict()

export const ExamCreateWithoutQuestionsInputObjectSchema = Schema
