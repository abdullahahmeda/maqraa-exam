/* eslint-disable */
import { z } from 'zod'
import { ExamUncheckedCreateNestedManyWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateNestedManyWithoutCurriculumInput.schema'
import { CurriculumUncheckedCreateNestedManyWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateNestedManyWithoutTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedCreateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    courseId: z.string(),
    exams: z
      .lazy(
        () => ExamUncheckedCreateNestedManyWithoutCurriculumInputObjectSchema
      )
      .optional(),
    curricula: z
      .lazy(
        () => CurriculumUncheckedCreateNestedManyWithoutTrackInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const TrackUncheckedCreateInputObjectSchema = Schema
