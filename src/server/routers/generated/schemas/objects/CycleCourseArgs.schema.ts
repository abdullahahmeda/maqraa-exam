/* eslint-disable */
import { z } from 'zod'
import { CycleCourseSelectObjectSchema } from './CycleCourseSelect.schema'
import { CycleCourseIncludeObjectSchema } from './CycleCourseInclude.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCourseArgs, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    select: z.lazy(() => CycleCourseSelectObjectSchema).optional(),
    include: z.lazy(() => CycleCourseIncludeObjectSchema).optional(),
  })
  .strict()

export const CycleCourseArgsObjectSchema = Schema
