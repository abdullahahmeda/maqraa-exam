/* eslint-disable */
import { z } from 'zod'
import { CycleCourseScalarWhereInputObjectSchema } from './CycleCourseScalarWhereInput.schema'
import { CycleCourseUpdateManyMutationInputObjectSchema } from './CycleCourseUpdateManyMutationInput.schema'
import { CycleCourseUncheckedUpdateManyWithoutCyclesInputObjectSchema } from './CycleCourseUncheckedUpdateManyWithoutCyclesInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CycleCourseUpdateManyWithWhereWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CycleCourseScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => CycleCourseUpdateManyMutationInputObjectSchema),
      z.lazy(
        () => CycleCourseUncheckedUpdateManyWithoutCyclesInputObjectSchema
      ),
    ]),
  })
  .strict()

export const CycleCourseUpdateManyWithWhereWithoutCourseInputObjectSchema =
  Schema
