/* eslint-disable */
import { z } from 'zod'
import { QuestionUpdateWithoutExamsInputObjectSchema } from './QuestionUpdateWithoutExamsInput.schema'
import { QuestionUncheckedUpdateWithoutExamsInputObjectSchema } from './QuestionUncheckedUpdateWithoutExamsInput.schema'
import { QuestionCreateWithoutExamsInputObjectSchema } from './QuestionCreateWithoutExamsInput.schema'
import { QuestionUncheckedCreateWithoutExamsInputObjectSchema } from './QuestionUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUpsertWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => QuestionUpdateWithoutExamsInputObjectSchema),
      z.lazy(() => QuestionUncheckedUpdateWithoutExamsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => QuestionCreateWithoutExamsInputObjectSchema),
      z.lazy(() => QuestionUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const QuestionUpsertWithoutExamsInputObjectSchema = Schema
