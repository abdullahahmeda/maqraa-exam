/* eslint-disable */
import { z } from 'zod'
import { CurriculumSelectObjectSchema } from './CurriculumSelect.schema'
import { CurriculumIncludeObjectSchema } from './CurriculumInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => CurriculumSelectObjectSchema).optional(),
    include: z.lazy(() => CurriculumIncludeObjectSchema).optional(),
  })
  .strict()

export const CurriculumArgsObjectSchema = Schema
