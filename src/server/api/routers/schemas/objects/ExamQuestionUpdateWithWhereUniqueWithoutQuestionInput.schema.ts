/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithoutQuestionInputObjectSchema } from './ExamQuestionUpdateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedUpdateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedUpdateWithoutQuestionInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateWithWhereUniqueWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamQuestionUpdateWithoutQuestionInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedUpdateWithoutQuestionInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionUpdateWithWhereUniqueWithoutQuestionInputObjectSchema =
  Schema
