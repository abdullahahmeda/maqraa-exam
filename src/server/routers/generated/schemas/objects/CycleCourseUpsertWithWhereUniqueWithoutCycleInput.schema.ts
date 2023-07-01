/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithoutCycleInputObjectSchema } from './CycleCourseUpdateWithoutCycleInput.schema'
import { CycleCourseUncheckedUpdateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedUpdateWithoutCycleInput.schema'
import { CycleCourseCreateWithoutCycleInputObjectSchema } from './CycleCourseCreateWithoutCycleInput.schema'
import { CycleCourseUncheckedCreateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpsertWithWhereUniqueWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CycleCourseUpdateWithoutCycleInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedUpdateWithoutCycleInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseUpsertWithWhereUniqueWithoutCycleInputObjectSchema =
  Schema
