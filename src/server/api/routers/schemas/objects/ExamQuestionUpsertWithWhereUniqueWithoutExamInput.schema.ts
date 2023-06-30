/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithoutExamInputObjectSchema } from './ExamQuestionUpdateWithoutExamInput.schema'
import { ExamQuestionUncheckedUpdateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedUpdateWithoutExamInput.schema'
import { ExamQuestionCreateWithoutExamInputObjectSchema } from './ExamQuestionCreateWithoutExamInput.schema'
import { ExamQuestionUncheckedCreateWithoutExamInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutExamInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpsertWithWhereUniqueWithoutExamInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => ExamQuestionUpdateWithoutExamInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedUpdateWithoutExamInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamQuestionCreateWithoutExamInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedCreateWithoutExamInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionUpsertWithWhereUniqueWithoutExamInputObjectSchema =
  Schema
