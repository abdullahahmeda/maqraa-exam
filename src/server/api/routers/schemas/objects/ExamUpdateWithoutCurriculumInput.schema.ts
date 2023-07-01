/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema'
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema'
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'
import { UserUpdateOneWithoutExamsNestedInputObjectSchema } from './UserUpdateOneWithoutExamsNestedInput.schema'
import { CourseUpdateOneRequiredWithoutExamsNestedInputObjectSchema } from './CourseUpdateOneRequiredWithoutExamsNestedInput.schema'
import { ExamQuestionUpdateManyWithoutExamNestedInputObjectSchema } from './ExamQuestionUpdateManyWithoutExamNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateWithoutCurriculumInput,
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
    difficulty: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    grade: z
      .union([
        z.number(),
        z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema),
      ])
      .optional()
      .nullable(),
    submittedAt: z
      .union([
        z.union([z.date(), z.string().datetime().optional()]),
        z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema),
      ])
      .optional()
      .nullable(),
    createdAt: z
      .union([
        z.union([z.date(), z.string().datetime().optional()]),
        z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    user: z
      .lazy(() => UserUpdateOneWithoutExamsNestedInputObjectSchema)
      .optional(),
    course: z
      .lazy(() => CourseUpdateOneRequiredWithoutExamsNestedInputObjectSchema)
      .optional(),
    questions: z
      .lazy(() => ExamQuestionUpdateManyWithoutExamNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const ExamUpdateWithoutCurriculumInputObjectSchema = Schema
