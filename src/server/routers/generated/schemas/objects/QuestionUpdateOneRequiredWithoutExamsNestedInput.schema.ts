/* eslint-disable */
import { z } from 'zod'
import { QuestionCreateWithoutExamsInputObjectSchema } from './QuestionCreateWithoutExamsInput.schema'
import { QuestionUncheckedCreateWithoutExamsInputObjectSchema } from './QuestionUncheckedCreateWithoutExamsInput.schema'
import { QuestionCreateOrConnectWithoutExamsInputObjectSchema } from './QuestionCreateOrConnectWithoutExamsInput.schema'
import { QuestionUpsertWithoutExamsInputObjectSchema } from './QuestionUpsertWithoutExamsInput.schema'
import { QuestionWhereUniqueInputObjectSchema } from './QuestionWhereUniqueInput.schema'
import { QuestionUpdateWithoutExamsInputObjectSchema } from './QuestionUpdateWithoutExamsInput.schema'
import { QuestionUncheckedUpdateWithoutExamsInputObjectSchema } from './QuestionUncheckedUpdateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.QuestionUpdateOneRequiredWithoutExamsNestedInput,
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
    upsert: z
      .lazy(() => QuestionUpsertWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => QuestionWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => QuestionUpdateWithoutExamsInputObjectSchema),
        z.lazy(() => QuestionUncheckedUpdateWithoutExamsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const QuestionUpdateOneRequiredWithoutExamsNestedInputObjectSchema =
  Schema
