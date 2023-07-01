/* eslint-disable */
import { z } from 'zod'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseCreateWithoutCyclesInputObjectSchema } from './CourseCreateWithoutCyclesInput.schema'
import { CourseUncheckedCreateWithoutCyclesInputObjectSchema } from './CourseUncheckedCreateWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateOrConnectWithoutCyclesInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CourseCreateWithoutCyclesInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutCyclesInputObjectSchema),
    ]),
  })
  .strict()

export const CourseCreateOrConnectWithoutCyclesInputObjectSchema = Schema
