/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithoutCourseInputObjectSchema } from './CycleCourseUpdateWithoutCourseInput.schema'
import { CycleCourseUncheckedUpdateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedUpdateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CycleCourseUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseUpdateWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
