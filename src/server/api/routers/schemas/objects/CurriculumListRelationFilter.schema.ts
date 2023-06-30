/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereInputObjectSchema } from './CurriculumWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumListRelationFilter,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    every: z.lazy(() => CurriculumWhereInputObjectSchema).optional(),
    some: z.lazy(() => CurriculumWhereInputObjectSchema).optional(),
    none: z.lazy(() => CurriculumWhereInputObjectSchema).optional(),
  })
  .strict()

export const CurriculumListRelationFilterObjectSchema = Schema
