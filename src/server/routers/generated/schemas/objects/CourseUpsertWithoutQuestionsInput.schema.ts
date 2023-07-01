/* eslint-disable */
import { z } from 'zod'
import { CourseUpdateWithoutQuestionsInputObjectSchema } from './CourseUpdateWithoutQuestionsInput.schema'
import { CourseUncheckedUpdateWithoutQuestionsInputObjectSchema } from './CourseUncheckedUpdateWithoutQuestionsInput.schema'
import { CourseCreateWithoutQuestionsInputObjectSchema } from './CourseCreateWithoutQuestionsInput.schema'
import { CourseUncheckedCreateWithoutQuestionsInputObjectSchema } from './CourseUncheckedCreateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpsertWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CourseUpdateWithoutQuestionsInputObjectSchema),
      z.lazy(() => CourseUncheckedUpdateWithoutQuestionsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CourseCreateWithoutQuestionsInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutQuestionsInputObjectSchema),
    ]),
  })
  .strict()

export const CourseUpsertWithoutQuestionsInputObjectSchema = Schema
