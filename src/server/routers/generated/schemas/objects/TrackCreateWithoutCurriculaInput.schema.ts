/* eslint-disable */
import { z } from 'zod'
import { CourseCreateNestedOneWithoutCurriculaInputObjectSchema } from './CourseCreateNestedOneWithoutCurriculaInput.schema'
import { ExamCreateNestedManyWithoutCurriculumInputObjectSchema } from './ExamCreateNestedManyWithoutCurriculumInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.TrackCreateWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    course: z.lazy(
      () => CourseCreateNestedOneWithoutCurriculaInputObjectSchema
    ),
    exams: z
      .lazy(() => ExamCreateNestedManyWithoutCurriculumInputObjectSchema)
      .optional(),
  })
  .strict()

export const TrackCreateWithoutCurriculaInputObjectSchema = Schema
