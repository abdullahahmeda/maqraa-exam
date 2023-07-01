/* eslint-disable */
import { z } from 'zod'
import { CycleCreateWithoutCoursesInputObjectSchema } from './CycleCreateWithoutCoursesInput.schema'
import { CycleUncheckedCreateWithoutCoursesInputObjectSchema } from './CycleUncheckedCreateWithoutCoursesInput.schema'
import { CycleCreateOrConnectWithoutCoursesInputObjectSchema } from './CycleCreateOrConnectWithoutCoursesInput.schema'
import { CycleWhereUniqueInputObjectSchema } from './CycleWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCreateNestedOneWithoutCoursesInput,
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
    connect: z.lazy(() => CycleWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CycleCreateNestedOneWithoutCoursesInputObjectSchema = Schema
