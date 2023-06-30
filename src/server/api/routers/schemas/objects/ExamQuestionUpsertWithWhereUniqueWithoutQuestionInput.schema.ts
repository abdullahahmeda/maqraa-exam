/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionUpdateWithoutQuestionInputObjectSchema } from './ExamQuestionUpdateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedUpdateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedUpdateWithoutQuestionInput.schema'
import { ExamQuestionCreateWithoutQuestionInputObjectSchema } from './ExamQuestionCreateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutQuestionInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpsertWithWhereUniqueWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => ExamQuestionUpdateWithoutQuestionInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedUpdateWithoutQuestionInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamQuestionCreateWithoutQuestionInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionUpsertWithWhereUniqueWithoutQuestionInputObjectSchema =
  Schema
