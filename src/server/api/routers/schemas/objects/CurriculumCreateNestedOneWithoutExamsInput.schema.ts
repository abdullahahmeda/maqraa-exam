/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutExamsInputObjectSchema } from './CurriculumCreateWithoutExamsInput.schema'
import { CurriculumUncheckedCreateWithoutExamsInputObjectSchema } from './CurriculumUncheckedCreateWithoutExamsInput.schema'
import { CurriculumCreateOrConnectWithoutExamsInputObjectSchema } from './CurriculumCreateOrConnectWithoutExamsInput.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateNestedOneWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CurriculumCreateWithoutExamsInputObjectSchema),
        z.lazy(() => CurriculumUncheckedCreateWithoutExamsInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CurriculumCreateOrConnectWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CurriculumWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CurriculumCreateNestedOneWithoutExamsInputObjectSchema = Schema
