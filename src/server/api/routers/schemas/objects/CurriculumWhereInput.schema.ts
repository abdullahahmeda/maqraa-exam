/* eslint-disable */
import { z } from 'zod'
import { StringFilterObjectSchema } from './StringFilter.schema'
import { IntFilterObjectSchema } from './IntFilter.schema'
import { CourseRelationFilterObjectSchema } from './CourseRelationFilter.schema'
import { CourseWhereInputObjectSchema } from './CourseWhereInput.schema'
import { ExamListRelationFilterObjectSchema } from './ExamListRelationFilter.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumWhereInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CurriculumWhereInputObjectSchema),
        z.lazy(() => CurriculumWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CurriculumWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CurriculumWhereInputObjectSchema),
        z.lazy(() => CurriculumWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    courseId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    fromPage: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    toPage: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    course: z
      .union([
        z.lazy(() => CourseRelationFilterObjectSchema),
        z.lazy(() => CourseWhereInputObjectSchema),
      ])
      .optional(),
    exams: z.lazy(() => ExamListRelationFilterObjectSchema).optional(),
  })
  .strict()

export const CurriculumWhereInputObjectSchema = Schema
