/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseCreateWithoutCourseInputObjectSchema } from './CycleCourseCreateWithoutCourseInput.schema'
import { CycleCourseUncheckedCreateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseCreateOrConnectWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseCreateOrConnectWithoutCourseInputObjectSchema = Schema
