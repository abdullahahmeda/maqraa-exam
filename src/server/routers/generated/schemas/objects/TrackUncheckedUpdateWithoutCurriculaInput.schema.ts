/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { ExamUncheckedUpdateManyWithoutCurriculumNestedInputObjectSchema } from './ExamUncheckedUpdateManyWithoutCurriculumNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedUpdateWithoutCurriculaInput,
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
    courseId: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    exams: z
      .lazy(
        () => ExamUncheckedUpdateManyWithoutCurriculumNestedInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const TrackUncheckedUpdateWithoutCurriculaInputObjectSchema = Schema
