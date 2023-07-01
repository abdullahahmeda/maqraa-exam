/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { QuestionUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './QuestionUncheckedUpdateManyWithoutCourseNestedInput.schema'
import { ExamUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './ExamUncheckedUpdateManyWithoutCourseNestedInput.schema'
import { CycleCourseUncheckedUpdateManyWithoutCourseNestedInputObjectSchema } from './CycleCourseUncheckedUpdateManyWithoutCourseNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedUpdateWithoutCurriculaInput,
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
      .lazy(
        () => QuestionUncheckedUpdateManyWithoutCourseNestedInputObjectSchema
      )
      .optional(),
    exams: z
      .lazy(() => ExamUncheckedUpdateManyWithoutCourseNestedInputObjectSchema)
      .optional(),
    cycles: z
      .lazy(
        () => CycleCourseUncheckedUpdateManyWithoutCourseNestedInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CourseUncheckedUpdateWithoutCurriculaInputObjectSchema = Schema
