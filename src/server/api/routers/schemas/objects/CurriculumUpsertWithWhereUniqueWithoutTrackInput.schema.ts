/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithoutTrackInputObjectSchema } from './CurriculumUpdateWithoutTrackInput.schema'
import { CurriculumUncheckedUpdateWithoutTrackInputObjectSchema } from './CurriculumUncheckedUpdateWithoutTrackInput.schema'
import { CurriculumCreateWithoutTrackInputObjectSchema } from './CurriculumCreateWithoutTrackInput.schema'
import { CurriculumUncheckedCreateWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateWithoutTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpsertWithWhereUniqueWithoutTrackInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CurriculumUpdateWithoutTrackInputObjectSchema),
      z.lazy(() => CurriculumUncheckedUpdateWithoutTrackInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutTrackInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutTrackInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumUpsertWithWhereUniqueWithoutTrackInputObjectSchema =
  Schema
