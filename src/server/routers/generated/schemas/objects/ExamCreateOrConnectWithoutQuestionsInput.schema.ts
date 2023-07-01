/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamCreateWithoutQuestionsInputObjectSchema } from './ExamCreateWithoutQuestionsInput.schema'
import { ExamUncheckedCreateWithoutQuestionsInputObjectSchema } from './ExamUncheckedCreateWithoutQuestionsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateOrConnectWithoutQuestionsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamCreateWithoutQuestionsInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutQuestionsInputObjectSchema),
    ]),
  })
  .strict()

export const ExamCreateOrConnectWithoutQuestionsInputObjectSchema = Schema
