/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutQuestionsInputObjectSchema } from './CourseCreateWithoutQuestionsInput.schema'
import { CourseUncheckedCreateWithoutQuestionsInputObjectSchema } from './CourseUncheckedCreateWithoutQuestionsInput.schema'
import { CourseCreateOrConnectWithoutQuestionsInputObjectSchema } from './CourseCreateOrConnectWithoutQuestionsInput.schema'
import { CourseUpsertWithoutQuestionsInputObjectSchema } from './CourseUpsertWithoutQuestionsInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseUpdateWithoutQuestionsInputObjectSchema } from './CourseUpdateWithoutQuestionsInput.schema'
import { CourseUncheckedUpdateWithoutQuestionsInputObjectSchema } from './CourseUncheckedUpdateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseUpdateOneRequiredWithoutQuestionsNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutQuestionsInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutQuestionsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutQuestionsInputObjectSchema)
      .optional(),
    upsert: z
      .lazy(() => CourseUpsertWithoutQuestionsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CourseUpdateWithoutQuestionsInputObjectSchema),
        z.lazy(() => CourseUncheckedUpdateWithoutQuestionsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CourseUpdateOneRequiredWithoutQuestionsNestedInputObjectSchema =
  Schema
