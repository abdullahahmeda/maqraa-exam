/* eslint-disable */
import { z } from 'zod'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'
import { ExamCreateWithoutUserInputObjectSchema } from './ExamCreateWithoutUserInput.schema'
import { ExamUncheckedCreateWithoutUserInputObjectSchema } from './ExamUncheckedCreateWithoutUserInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateOrConnectWithoutUserInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => ExamCreateWithoutUserInputObjectSchema),
      z.lazy(() => ExamUncheckedCreateWithoutUserInputObjectSchema),
    ]),
  })
  .strict()

export const ExamCreateOrConnectWithoutUserInputObjectSchema = Schema
