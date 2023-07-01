/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { ExamUncheckedUpdateManyWithoutCurriculumNestedInputObjectSchema } from './ExamUncheckedUpdateManyWithoutCurriculumNestedInput.schema'
import { CurriculumUncheckedUpdateManyWithoutTrackNestedInputObjectSchema } from './CurriculumUncheckedUpdateManyWithoutTrackNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedUpdateInput,
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
    curricula: z
      .lazy(
        () => CurriculumUncheckedUpdateManyWithoutTrackNestedInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const TrackUncheckedUpdateInputObjectSchema = Schema
