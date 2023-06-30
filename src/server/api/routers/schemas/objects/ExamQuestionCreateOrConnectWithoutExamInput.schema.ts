/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionCreateWithoutExamInputObjectSchema } from './ExamQuestionCreateWithoutExamInput.schema'
import { ExamQuestionUncheckedCreateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateOrConnectWithoutExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamQuestionCreateWithoutExamInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedCreateWithoutExamInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionCreateOrConnectWithoutExamInputObjectSchema = Schema
