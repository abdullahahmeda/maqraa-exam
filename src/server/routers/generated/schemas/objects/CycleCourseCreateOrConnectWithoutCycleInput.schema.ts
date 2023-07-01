/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseCreateWithoutCycleInputObjectSchema } from './CycleCourseCreateWithoutCycleInput.schema'
import { CycleCourseUncheckedCreateWithoutCycleInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCycleInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateOrConnectWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CycleCourseCreateWithoutCycleInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedCreateWithoutCycleInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseCreateOrConnectWithoutCycleInputObjectSchema = Schema
