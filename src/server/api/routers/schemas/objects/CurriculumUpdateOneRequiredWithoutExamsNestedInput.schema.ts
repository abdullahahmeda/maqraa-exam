/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutExamsInputObjectSchema } from './CurriculumCreateWithoutExamsInput.schema'
import { CurriculumUncheckedCreateWithoutExamsInputObjectSchema } from './CurriculumUncheckedCreateWithoutExamsInput.schema'
import { CurriculumCreateOrConnectWithoutExamsInputObjectSchema } from './CurriculumCreateOrConnectWithoutExamsInput.schema'
import { CurriculumUpsertWithoutExamsInputObjectSchema } from './CurriculumUpsertWithoutExamsInput.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithoutExamsInputObjectSchema } from './CurriculumUpdateWithoutExamsInput.schema'
import { CurriculumUncheckedUpdateWithoutExamsInputObjectSchema } from './CurriculumUncheckedUpdateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpdateOneRequiredWithoutExamsNestedInput,
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
    upsert: z
      .lazy(() => CurriculumUpsertWithoutExamsInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CurriculumWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CurriculumUpdateWithoutExamsInputObjectSchema),
        z.lazy(() => CurriculumUncheckedUpdateWithoutExamsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CurriculumUpdateOneRequiredWithoutExamsNestedInputObjectSchema =
  Schema
