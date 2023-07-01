/* eslint-disable */
import { z } from 'zod'
import { CycleCourseScalarWhereInputObjectSchema } from './CycleCourseScalarWhereInput.schema'
import { CycleCourseUpdateManyMutationInputObjectSchema } from './CycleCourseUpdateManyMutationInput.schema'
import { CycleCourseUncheckedUpdateManyWithoutCoursesInputObjectSchema } from './CycleCourseUncheckedUpdateManyWithoutCoursesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateManyWithWhereWithoutCycleInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => CycleCourseUpdateManyMutationInputObjectSchema),
      z.lazy(
        () => CycleCourseUncheckedUpdateManyWithoutCoursesInputObjectSchema
      ),
    ]),
  })
  .strict()

export const CycleCourseUpdateManyWithWhereWithoutCycleInputObjectSchema =
  Schema
