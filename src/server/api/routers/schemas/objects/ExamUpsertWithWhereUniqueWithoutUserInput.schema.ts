/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamUpdateWithoutUserInputObjectSchema } from './ExamUpdateWithoutUserInput.schema'
import { ExamUncheckedUpdateWithoutUserInputObjectSchema } from './ExamUncheckedUpdateWithoutUserInput.schema'
import { ExamCreateWithoutUserInputObjectSchema } from './ExamCreateWithoutUserInput.schema'
import { ExamUncheckedCreateWithoutUserInputObjectSchema } from './ExamUncheckedCreateWithoutUserInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamUpsertWithWhereUniqueWithoutUserInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => ExamUpdateWithoutUserInputObjectSchema),
      z.lazy(() => ExamUncheckedUpdateWithoutUserInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => ExamCreateWithoutUserInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutUserInputObjectSchema),
    ]),
  })
  .strict()

export const ExamUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema
