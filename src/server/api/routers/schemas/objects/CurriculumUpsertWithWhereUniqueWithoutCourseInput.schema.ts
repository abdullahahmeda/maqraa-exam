/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithoutCourseInputObjectSchema } from './CurriculumUpdateWithoutCourseInput.schema'
import { CurriculumUncheckedUpdateWithoutCourseInputObjectSchema } from './CurriculumUncheckedUpdateWithoutCourseInput.schema'
import { CurriculumCreateWithoutCourseInputObjectSchema } from './CurriculumCreateWithoutCourseInput.schema'
import { CurriculumUncheckedCreateWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpsertWithWhereUniqueWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CurriculumUpdateWithoutCourseInputObjectSchema),
      z.lazy(() => CurriculumUncheckedUpdateWithoutCourseInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutCourseInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumUpsertWithWhereUniqueWithoutCourseInputObjectSchema =
  Schema
