/* eslint-disable */
import { z } from 'zod'
import { CycleCourseWhereUniqueInputObjectSchema } from './CycleCourseWhereUniqueInput.schema'
import { CycleCourseUpdateWithoutCourseInputObjectSchema } from './CycleCourseUpdateWithoutCourseInput.schema'
import { CycleCourseUncheckedUpdateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedUpdateWithoutCourseInput.schema'
import { CycleCourseCreateWithoutCourseInputObjectSchema } from './CycleCourseCreateWithoutCourseInput.schema'
import { CycleCourseUncheckedCreateWithoutCourseInputObjectSchema } from './CycleCourseUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpsertWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CycleCourseUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CycleCourseCreateWithoutCourseInputObjectSchema),
      z.lazy(() => CycleCourseUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CycleCourseUpsertWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
