/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumCreateWithoutCourseInputObjectSchema } from './CurriculumCreateWithoutCourseInput.schema'
import { CurriculumUncheckedCreateWithoutCourseInputObjectSchema } from './CurriculumUncheckedCreateWithoutCourseInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateOrConnectWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutCourseInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutCourseInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumCreateOrConnectWithoutCourseInputObjectSchema = Schema
