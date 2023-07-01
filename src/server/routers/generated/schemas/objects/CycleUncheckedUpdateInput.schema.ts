/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { CycleCourseUncheckedUpdateManyWithoutCycleNestedInputObjectSchema } from './CycleCourseUncheckedUpdateManyWithoutCycleNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleUncheckedUpdateInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    id: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    courses: z
      .lazy(
        () => CycleCourseUncheckedUpdateManyWithoutCycleNestedInputObjectSchema
      )
      .optional(),
  })
  .strict()

export const CycleUncheckedUpdateInputObjectSchema = Schema
