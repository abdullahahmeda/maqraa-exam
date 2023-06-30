/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithoutCourseInputObjectSchema } from './CurriculumUpdateWithoutCourseInput.schema'
import { CurriculumUncheckedUpdateWithoutCourseInputObjectSchema } from './CurriculumUncheckedUpdateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpdateWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CurriculumUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => CurriculumUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumUpdateWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
