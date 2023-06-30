/* eslint-disable */
import { z } from 'zod'
import { CurriculumUpdateWithoutExamsInputObjectSchema } from './CurriculumUpdateWithoutExamsInput.schema'
import { CurriculumUncheckedUpdateWithoutExamsInputObjectSchema } from './CurriculumUncheckedUpdateWithoutExamsInput.schema'
import { CurriculumCreateWithoutExamsInputObjectSchema } from './CurriculumCreateWithoutExamsInput.schema'
import { CurriculumUncheckedCreateWithoutExamsInputObjectSchema } from './CurriculumUncheckedCreateWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpsertWithoutExamsInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CurriculumUpdateWithoutExamsInputObjectSchema),
      z.lazy(() => CurriculumUncheckedUpdateWithoutExamsInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutExamsInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutExamsInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumUpsertWithoutExamsInputObjectSchema = Schema
