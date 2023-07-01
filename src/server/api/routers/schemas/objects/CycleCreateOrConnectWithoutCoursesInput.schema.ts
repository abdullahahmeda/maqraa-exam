/* eslint-disable */
import { z } from 'zod'
import { CycleWhereUniqueInputObjectSchema } from './CycleWhereUniqueInput.schema'
import { CycleCreateWithoutCoursesInputObjectSchema } from './CycleCreateWithoutCoursesInput.schema'
import { CycleUncheckedCreateWithoutCoursesInputObjectSchema } from './CycleUncheckedCreateWithoutCoursesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCreateOrConnectWithoutCoursesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CycleCreateWithoutCoursesInputObjectSchema),
      z.lazy(() => CycleUncheckedCreateWithoutCoursesInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCreateOrConnectWithoutCoursesInputObjectSchema = Schema
