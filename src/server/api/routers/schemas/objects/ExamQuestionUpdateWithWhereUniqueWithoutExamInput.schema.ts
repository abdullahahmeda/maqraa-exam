/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithoutExamInputObjectSchema } from './ExamQuestionUpdateWithoutExamInput.schema'
import { ExamQuestionUncheckedUpdateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedUpdateWithoutExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateWithWhereUniqueWithoutExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamQuestionUpdateWithoutExamInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedUpdateWithoutExamInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionUpdateWithWhereUniqueWithoutExamInputObjectSchema =
  Schema
