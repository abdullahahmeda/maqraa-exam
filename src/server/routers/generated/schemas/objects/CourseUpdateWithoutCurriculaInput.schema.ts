/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { QuestionUpdateManyWithoutCourseNestedInputObjectSchema } from './QuestionUpdateManyWithoutCourseNestedInput.schema'
import { ExamUpdateManyWithoutCourseNestedInputObjectSchema } from './ExamUpdateManyWithoutCourseNestedInput.schema'
import { CycleCourseUpdateManyWithoutCourseNestedInputObjectSchema } from './CycleCourseUpdateManyWithoutCourseNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpdateWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
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
    questions: z
      .lazy(() => QuestionUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
    exams: z
      .lazy(() => ExamUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
    cycles: z
      .lazy(() => CycleCourseUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseUpdateWithoutCurriculaInputObjectSchema = Schema
