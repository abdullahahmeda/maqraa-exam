/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionCreateWithoutCourseInputObjectSchema } from './QuestionCreateWithoutCourseInput.schema'
import { QuestionUncheckedCreateWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCreateOrConnectWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => QuestionWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => QuestionCreateWithoutCourseInputObjectSchema),
      z.lazy(() => QuestionUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const QuestionCreateOrConnectWithoutCourseInputObjectSchema = Schema
