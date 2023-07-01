/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { ExamUpdateManyWithoutCurriculumNestedInputObjectSchema } from './ExamUpdateManyWithoutCurriculumNestedInput.schema'
import { CurriculumUpdateManyWithoutTrackNestedInputObjectSchema } from './CurriculumUpdateManyWithoutTrackNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUpdateWithoutCourseInput,
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
    exams: z
      .lazy(() => ExamUpdateManyWithoutCurriculumNestedInputObjectSchema)
      .optional(),
    curricula: z
      .lazy(() => CurriculumUpdateManyWithoutTrackNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const TrackUpdateWithoutCourseInputObjectSchema = Schema
