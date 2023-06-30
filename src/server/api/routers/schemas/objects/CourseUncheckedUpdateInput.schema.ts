/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { CurriculumUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './CurriculumUncheckedUpdateManyWithoutCourseNestedInput.schema'
import { QuestionUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './QuestionUncheckedUpdateManyWithoutCourseNestedInput.schema'
import { ExamUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './ExamUncheckedUpdateManyWithoutCourseNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedUpdateInput,
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
    curricula: z
      .lazy(
        () => CurriculumUncheckedUpdateManyWithoutCourseNestedInputObjectSchema
      )
      .optional(),
    questions: z
      .lazy(
        () => QuestionUncheckedUpdateManyWithoutCourseNestedInputObjectSchema
      )
      .optional(),
    exams: z
      .lazy(() => ExamUncheckedUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CourseUncheckedUpdateInputObjectSchema = Schema
