/* eslint-disable */
import { z } from 'zod'
import { ExamUpdateWithoutQuestionsInputObjectSchema } from './ExamUpdateWithoutQuestionsInput.schema'
import { ExamUncheckedUpdateWithoutQuestionsInputObjectSchema } from './ExamUncheckedUpdateWithoutQuestionsInput.schema'
import { ExamCreateWithoutQuestionsInputObjectSchema } from './ExamCreateWithoutQuestionsInput.schema'
import { ExamUncheckedCreateWithoutQuestionsInputObjectSchema } from './ExamUncheckedCreateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpsertWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => ExamUpdateWithoutQuestionsInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutQuestionsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamCreateWithoutQuestionsInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutQuestionsInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpsertWithoutQuestionsInputObjectSchema = Schema
