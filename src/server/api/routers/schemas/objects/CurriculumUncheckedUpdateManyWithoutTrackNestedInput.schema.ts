/* eslint-disable */
import { z } from 'zod'
import { CurriculumCreateWithoutTrackInputObjectSchema } from './CurriculumCreateWithoutTrackInput.schema'
import { CurriculumUncheckedCreateWithoutTrackInputObjectSchema } from './CurriculumUncheckedCreateWithoutTrackInput.schema'
import { CurriculumCreateOrConnectWithoutTrackInputObjectSchema } from './CurriculumCreateOrConnectWithoutTrackInput.schema'
import { CurriculumUpsertWithWhereUniqueWithoutTrackInputObjectSchema } from './CurriculumUpsertWithWhereUniqueWithoutTrackInput.schema'
import { CurriculumCreateManyTrackInputEnvelopeObjectSchema } from './CurriculumCreateManyTrackInputEnvelope.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './CurriculumWhereUniqueInput.schema'
import { CurriculumUpdateWithWhereUniqueWithoutTrackInputObjectSchema } from './CurriculumUpdateWithWhereUniqueWithoutTrackInput.schema'
import { CurriculumUpdateManyWithWhereWithoutTrackInputObjectSchema } from './CurriculumUpdateManyWithWhereWithoutTrackInput.schema'
import { CurriculumScalarWhereInputObjectSchema } from './CurriculumScalarWhereInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUncheckedUpdateManyWithoutTrackNestedInput,
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
    upsert: z
      .union([
        z.lazy(
          () => CurriculumUpsertWithWhereUniqueWithoutTrackInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpsertWithWhereUniqueWithoutTrackInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => CurriculumCreateManyTrackInputEnvelopeObjectSchema)
      .optional(),
    set: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema),
        z.lazy(() => CurriculumWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(
          () => CurriculumUpdateWithWhereUniqueWithoutTrackInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpdateWithWhereUniqueWithoutTrackInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(
          () => CurriculumUpdateManyWithWhereWithoutTrackInputObjectSchema
        ),
        z
          .lazy(
            () => CurriculumUpdateManyWithWhereWithoutTrackInputObjectSchema
          )
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => CurriculumScalarWhereInputObjectSchema),
        z.lazy(() => CurriculumScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const CurriculumUncheckedUpdateManyWithoutTrackNestedInputObjectSchema =
  Schema
