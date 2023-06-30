/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionWhereUniqueInputObjectSchema } from './ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionCreateWithoutQuestionInputObjectSchema } from './ExamQuestionCreateWithoutQuestionInput.schema'
import { ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema } from './ExamQuestionUncheckedCreateWithoutQuestionInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionCreateOrConnectWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamQuestionCreateWithoutQuestionInputObjectSchema),
      z.lazy(() => ExamQuestionUncheckedCreateWithoutQuestionInputObjectSchema),
    ]),
  })
  .strict()

export const ExamQuestionCreateOrConnectWithoutQuestionInputObjectSchema =
  Schema
