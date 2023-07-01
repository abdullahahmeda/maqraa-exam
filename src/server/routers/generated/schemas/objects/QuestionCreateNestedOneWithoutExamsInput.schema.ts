/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateWithoutExamsInputObjectSchema } from './QuestionCreateWithoutExamsInput.schema'
import { QuestionUncheckedCreateWithoutExamsInputObjectSchema } from './QuestionUncheckedCreateWithoutExamsInput.schema'
import { QuestionCreateOrConnectWithoutExamsInputObjectSchema } from './QuestionCreateOrConnectWithoutExamsInput.schema'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionCreateNestedOneWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => QuestionCreateWithoutExamsInputObjectSchema),
        z.lazy(() => QuestionUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => QuestionCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => QuestionWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const QuestionCreateNestedOneWithoutExamsInputObjectSchema = Schema
