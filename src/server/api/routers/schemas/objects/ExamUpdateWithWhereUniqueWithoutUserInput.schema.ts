/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutUserInputObjectSchema } from './ExamUpdateWithoutUserInput.schema'
import { ExamUncheckedUpdateWithoutUserInputObjectSchema } from './ExamUncheckedUpdateWithoutUserInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpdateWithWhereUniqueWithoutUserInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamUpdateWithoutUserInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutUserInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema
