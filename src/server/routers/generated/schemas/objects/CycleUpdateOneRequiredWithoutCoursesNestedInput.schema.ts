/* eslint-disable */
import { z } from 'zod'
import { CycleCreateWithoutCoursesInputObjectSchema } from './CycleCreateWithoutCoursesInput.schema'
import { CycleUncheckedCreateWithoutCoursesInputObjectSchema } from './CycleUncheckedCreateWithoutCoursesInput.schema'
import { CycleCreateOrConnectWithoutCoursesInputObjectSchema } from './CycleCreateOrConnectWithoutCoursesInput.schema'
import { CycleUpsertWithoutCoursesInputObjectSchema } from './CycleUpsertWithoutCoursesInput.schema'
import { CycleWhereUniqueInputObjectSchema } from './CycleWhereUniqueInput.schema'
import { CycleUpdateWithoutCoursesInputObjectSchema } from './CycleUpdateWithoutCoursesInput.schema'
import { CycleUncheckedUpdateWithoutCoursesInputObjectSchema } from './CycleUncheckedUpdateWithoutCoursesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleUpdateOneRequiredWithoutCoursesNestedInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CycleCreateWithoutCoursesInputObjectSchema),
        z.lazy(() => CycleUncheckedCreateWithoutCoursesInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CycleCreateOrConnectWithoutCoursesInputObjectSchema)
      .optional(),
    upsert: z.lazy(() => CycleUpsertWithoutCoursesInputObjectSchema).optional(),
    connect: z.lazy(() => CycleWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => CycleUpdateWithoutCoursesInputObjectSchema),
        z.lazy(() => CycleUncheckedUpdateWithoutCoursesInputObjectSchema),
      ])
      .optional(),
  })
  .strict()

export const CycleUpdateOneRequiredWithoutCoursesNestedInputObjectSchema =
  Schema
