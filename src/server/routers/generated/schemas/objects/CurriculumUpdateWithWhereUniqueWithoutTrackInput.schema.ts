/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithoutTrackInputObjectSchema } from './CurriculumUpdateWithoutTrackInput.schema'
import { CurriculumUncheckedUpdateWithoutTrackInputObjectSchema } from './CurriculumUncheckedUpdateWithoutTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpdateWithWhereUniqueWithoutTrackInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CurriculumUpdateWithoutTrackInputObjectSchema),
      z.lazy(() => CurriculumUncheckedUpdateWithoutTrackInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumUpdateWithWhereUniqueWithoutTrackInputObjectSchema =
  Schema
