/* eslint-disable */
import { z } from 'zod'
import { CourseCreateWithoutCurriculaInputObjectSchema } from './CourseCreateWithoutCurriculaInput.schema'
import { CourseUncheckedCreateWithoutCurriculaInputObjectSchema } from './CourseUncheckedCreateWithoutCurriculaInput.schema'
import { CourseCreateOrConnectWithoutCurriculaInputObjectSchema } from './CourseCreateOrConnectWithoutCurriculaInput.schema'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateNestedOneWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CourseCreateWithoutCurriculaInputObjectSchema),
        z.lazy(() => CourseUncheckedCreateWithoutCurriculaInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => CourseCreateOrConnectWithoutCurriculaInputObjectSchema)
      .optional(),
    connect: z.lazy(() => CourseWhereUniqueInputObjectSchema).optional(),
  })
  .strict()

export const CourseCreateNestedOneWithoutCurriculaInputObjectSchema = Schema
