/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutTrackInputObjectSchema } from './CurriculumCreateWithoutTrackInput.schema'
import { CurriculumUncheckedCreateWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateWithoutTrackInput.schema'
import { CurriculumCreateOrConnectWithoutTrackInputObjectSchema } from './CurriculumCreateOrConnectWithoutTrackInput.schema'
import { CurriculumCreateManyTrackInputEnvelopeObjectSchema } from './CurriculumCreateManyTrackInputEnvelope.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumCreateNestedManyWithoutTrackInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => CurriculumCreateWithoutTrackInputObjectSchema),
        z.lazy(() => CurriculumCreateWithoutTrackInputObjectSchema).array(),
        z.lazy(() => CurriculumUncheckedCreateWithoutTrackInputObjectSchema),
        z
          .lazy(() => CurriculumUncheckedCreateWithoutTrackInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CurriculumCreateOrConnectWithoutTrackInputObjectSchema),
        z
          .lazy(() => CurriculumCreateOrConnectWithoutTrackInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CurriculumCreateManyTrackInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CurriculumCreateNestedManyWithoutTrackInputObjectSchema = Schema
