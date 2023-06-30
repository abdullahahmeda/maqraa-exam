/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumCreateWithoutExamsInputObjectSchema } from './CurriculumCreateWithoutExamsInput.schema'
import { CurriculumUncheckedCreateWithoutExamsInputObjectSchema } from './CurriculumUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateOrConnectWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutExamsInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumCreateOrConnectWithoutExamsInputObjectSchema = Schema
