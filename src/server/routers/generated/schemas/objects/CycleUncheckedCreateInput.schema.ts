/* eslint-disable */
import { z } from 'zod'
import { CycleCourseUncheckedCreateNestedManyWithoutCycleInputObjectSchema } from './CycleCourseUncheckedCreateNestedManyWithoutCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleUncheckedCreateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    courses: z
      .lazy(
        () => CycleCourseUncheckedCreateNestedManyWithoutCycleInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CycleUncheckedCreateInputObjectSchema = Schema
