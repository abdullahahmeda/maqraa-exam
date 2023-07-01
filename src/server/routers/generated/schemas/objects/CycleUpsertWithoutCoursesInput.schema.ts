/* eslint-disable */
import { z } from 'zod'
import { CycleUpdateWithoutCoursesInputObjectSchema } from './CycleUpdateWithoutCoursesInput.schema'
import { CycleUncheckedUpdateWithoutCoursesInputObjectSchema } from './CycleUncheckedUpdateWithoutCoursesInput.schema'
import { CycleCreateWithoutCoursesInputObjectSchema } from './CycleCreateWithoutCoursesInput.schema'
import { CycleUncheckedCreateWithoutCoursesInputObjectSchema } from './CycleUncheckedCreateWithoutCoursesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleUpsertWithoutCoursesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    update: z.union([
      z.lazy(() => CycleUpdateWithoutCoursesInputObjectSchema),
      z.lazy(() => CycleUncheckedUpdateWithoutCoursesInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CycleCreateWithoutCoursesInputObjectSchema),
      z.lazy(() => CycleUncheckedCreateWithoutCoursesInputObjectSchema),
    ]),
  })
  .strict()

export const CycleUpsertWithoutCoursesInputObjectSchema = Schema
