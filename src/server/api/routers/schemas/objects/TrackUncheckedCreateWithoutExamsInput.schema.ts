/* eslint-disable */
import { z } from 'zod'
import { CurriculumUncheckedCreateNestedManyWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateNestedManyWithoutTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackUncheckedCreateWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    courseId: z.string(),
    curricula: z
      .lazy(
        () => CurriculumUncheckedCreateNestedManyWithoutTrackInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const TrackUncheckedCreateWithoutExamsInputObjectSchema = Schema
