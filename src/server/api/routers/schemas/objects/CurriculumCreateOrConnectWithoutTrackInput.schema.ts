/* eslint-disable */
import { z } from 'zod'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumCreateWithoutTrackInputObjectSchema } from './CurriculumCreateWithoutTrackInput.schema'
import { CurriculumUncheckedCreateWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateWithoutTrackInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateOrConnectWithoutTrackInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CurriculumCreateWithoutTrackInputObjectSchema),
      z.lazy(() => CurriculumUncheckedCreateWithoutTrackInputObjectSchema),
    ]),
  })
  .strict()

export const CurriculumCreateOrConnectWithoutTrackInputObjectSchema = Schema
