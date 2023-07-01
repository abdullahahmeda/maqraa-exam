/* eslint-disable */
import { z } from 'zod'
import { CycleCourseCreateNestedManyWithoutCycleInputObjectSchema } from './CycleCourseCreateNestedManyWithoutCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleCreateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    courses: z
      .lazy(() => CycleCourseCreateNestedManyWithoutCycleInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleCreateInputObjectSchema = Schema
