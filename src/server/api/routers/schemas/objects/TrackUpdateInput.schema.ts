/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { CourseUpdateOneRequiredWithoutCurriculaNestedInputObjectSchema } from './CourseUpdateOneRequiredWithoutCurriculaNestedInput.schema'
import { ExamUpdateManyWithoutCurriculumNestedInputObjectSchema } from './ExamUpdateManyWithoutCurriculumNestedInput.schema'
import { CurriculumUpdateManyWithoutTrackNestedInputObjectSchema } from './CurriculumUpdateManyWithoutTrackNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.TrackUpdateInput, 'zenstack_transaction' | 'zenstack_guard'>
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
    course: z
      .lazy(
        () => CourseUpdateOneRequiredWithoutCurriculaNestedInputObjectSchema
      )
      .optional(),
    exams: z
      .lazy(() => ExamUpdateManyWithoutCurriculumNestedInputObjectSchema)
      .optional(),
    curricula: z
      .lazy(() => CurriculumUpdateManyWithoutTrackNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const TrackUpdateInputObjectSchema = Schema
