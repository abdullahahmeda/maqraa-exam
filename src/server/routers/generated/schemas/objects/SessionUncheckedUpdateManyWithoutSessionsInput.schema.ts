/* eslint-disable */
import { z } from 'zod'
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.SessionUncheckedUpdateManyWithoutSessionsInput,
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
    sessionToken: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    expires: z
      .union([
        z.union([z.date(), z.string().datetime().optional()]),
        z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const SessionUncheckedUpdateManyWithoutSessionsInputObjectSchema = Schema
