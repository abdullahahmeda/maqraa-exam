/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { CurriculumUpdateManyWithoutCourseNestedInputObjectSchema } from './CurriculumUpdateManyWithoutCourseNestedInput.schema'
import { QuestionUpdateManyWithoutCourseNestedInputObjectSchema } from './QuestionUpdateManyWithoutCourseNestedInput.schema'
import { ExamUpdateManyWithoutCourseNestedInputObjectSchema } from './ExamUpdateManyWithoutCourseNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseUpdateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    curricula: z
      .lazy(() => CurriculumUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => QuestionUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseUpdateInputObjectSchema = Schema
