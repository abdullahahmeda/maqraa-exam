/* eslint-disable */
import { z } from 'zod'
import { CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'
import { CourseCreateWithoutCurriculaInputObjectSchema } from './CourseCreateWithoutCurriculaInput.schema'
import { CourseUncheckedCreateWithoutCurriculaInputObjectSchema } from './CourseUncheckedCreateWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CourseCreateOrConnectWithoutCurriculaInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CourseCreateWithoutCurriculaInputObjectSchema),
      z.lazy(() => CourseUncheckedCreateWithoutCurriculaInputObjectSchema),
    ]),
  })
  .strict()

export const CourseCreateOrConnectWithoutCurriculaInputObjectSchema = Schema
