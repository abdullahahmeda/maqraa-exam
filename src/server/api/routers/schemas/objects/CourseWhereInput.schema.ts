/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { CurriculumListRelationFilterObjectSchema } from './CurriculumListRelationFilter.schema'
import { QuestionListRelationFilterObjectSchema } from './QuestionListRelationFilter.schema'
import { ExamListRelationFilterObjectSchema } from './ExamListRelationFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CourseWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CourseWhereInputObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CourseWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CourseWhereInputObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    curricula: z
      .lazy(() => CurriculumListRelationFilterObjectSchema)
      .optional(),
    questions: z.lazy(() => QuestionListRelationFilterObjectSchema).optional(),
    exams: z.lazy(() => ExamListRelationFilterObjectSchema).optional(),
  })
  .strict()

export const CourseWhereInputObjectSchema = Schema
