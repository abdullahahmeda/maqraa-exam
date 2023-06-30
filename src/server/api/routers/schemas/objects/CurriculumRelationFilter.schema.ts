/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereInputObjectSchema } from './CurriculumWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    is: z
      .lazy(() => CurriculumWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => CurriculumWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict()

export const CurriculumRelationFilterObjectSchema = Schema
