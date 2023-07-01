/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { CycleCourseUpdateManyWithoutCycleNestedInputObjectSchema } from './CycleCourseUpdateManyWithoutCycleNestedInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CycleUpdateInput, 'zenstack_transaction' | 'zenstack_guard'>
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
      .lazy(() => CycleCourseUpdateManyWithoutCycleNestedInputObjectSchema)
      .optional(),
  })
  .strict()

export const CycleUpdateInputObjectSchema = Schema
