/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithoutCycleInputObjectSchema } from './CycleCourseUpdateWithoutCycleInput.schema'
import { CycleCourseUncheckedUpdateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedUpdateWithoutCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateWithWhereUniqueWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CycleCourseUpdateWithoutCycleInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedUpdateWithoutCycleInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseUpdateWithWhereUniqueWithoutCycleInputObjectSchema =
  Schema
