/* eslint-disable */
import { z } from 'zod'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionCreateWithoutExamsInputObjectSchema } from './QuestionCreateWithoutExamsInput.schema'
import { QuestionUncheckedCreateWithoutExamsInputObjectSchema } from './QuestionUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCreateOrConnectWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => QuestionWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => QuestionCreateWithoutExamsInputObjectSchema),
      z.lazy(() => QuestionUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const QuestionCreateOrConnectWithoutExamsInputObjectSchema = Schema
