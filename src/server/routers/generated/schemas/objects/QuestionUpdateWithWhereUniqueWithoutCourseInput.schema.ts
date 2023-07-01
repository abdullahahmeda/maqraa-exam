/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionUpdateWithoutCourseInputObjectSchema } from './QuestionUpdateWithoutCourseInput.schema'
import { QuestionUncheckedUpdateWithoutCourseInputObjectSchema } from './QuestionUncheckedUpdateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUpdateWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => QuestionWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => QuestionUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => QuestionUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const QuestionUpdateWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
