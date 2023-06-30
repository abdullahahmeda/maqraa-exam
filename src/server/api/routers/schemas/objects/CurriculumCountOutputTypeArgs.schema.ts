/* eslint-disable */
import { z } from 'zod'
import { CurriculumCountOutputTypeSelectObjectSchema } from './CurriculumCountOutputTypeSelect.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCountOutputTypeArgs,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    select: z
      .lazy(() => CurriculumCountOutputTypeSelectObjectSchema)
      .optional(),
  })
  .strict()

export const CurriculumCountOutputTypeArgsObjectSchema = Schema
