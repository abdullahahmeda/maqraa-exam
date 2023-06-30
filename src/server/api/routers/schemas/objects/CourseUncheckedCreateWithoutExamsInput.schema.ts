/* eslint-disable */
import { z } from 'zod'
import { CurriculumUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateNestedManyWithoutCourseInput.schema'
import { QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateNestedManyWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUncheckedCreateWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    curricula: z
      .lazy(
        () => CurriculumUncheckedCreateNestedManyWithoutCourseInputObjectSchema
      )
      .optional(),
    questions: z
      .lazy(
        () => QuestionUncheckedCreateNestedManyWithoutCourseInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CourseUncheckedCreateWithoutExamsInputObjectSchema = Schema
