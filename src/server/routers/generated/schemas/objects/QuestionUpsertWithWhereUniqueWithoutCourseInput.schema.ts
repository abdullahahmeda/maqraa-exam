/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionUpdateWithoutCourseInputObjectSchema } from './QuestionUpdateWithoutCourseInput.schema'
import { QuestionUncheckedUpdateWithoutCourseInputObjectSchema } from './QuestionUncheckedUpdateWithoutCourseInput.schema'
import { QuestionCreateWithoutCourseInputObjectSchema } from './QuestionCreateWithoutCourseInput.schema'
import { QuestionUncheckedCreateWithoutCourseInputObjectSchema } from './QuestionUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUpsertWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => QuestionWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => QuestionUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => QuestionUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => QuestionCreateWithoutCourseInputObjectSchema),
      z.lazy(() => QuestionUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const QuestionUpsertWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
