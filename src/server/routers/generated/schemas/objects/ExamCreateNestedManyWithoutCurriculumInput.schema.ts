/* eslint-disable */
import { z } from 'zod'
import { ExamCreateWithoutCurriculumInputObjectSchema } from './ExamCreateWithoutCurriculumInput.schema'
import { ExamUncheckedCreateWithoutCurriculumInputObjectSchema } from './ExamUncheckedCreateWithoutCurriculumInput.schema'
import { ExamCreateOrConnectWithoutCurriculumInputObjectSchema } from './ExamCreateOrConnectWithoutCurriculumInput.schema'
import { ExamCreateManyCurriculumInputEnvelopeObjectSchema } from './ExamCreateManyCurriculumInputEnvelope.schema'
import { ExamWhereUniqueInputObjectSchema } from './ExamWhereUniqueInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamCreateNestedManyWithoutCurriculumInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    create: z
      .union([
        z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema),
        z.lazy(() => ExamCreateWithoutCurriculumInputObjectSchema).array(),
        z.lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema),
        z
          .lazy(() => ExamUncheckedCreateWithoutCurriculumInputObjectSchema)
          .array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => ExamCreateOrConnectWithoutCurriculumInputObjectSchema),
        z
          .lazy(() => ExamCreateOrConnectWithoutCurriculumInputObjectSchema)
          .array(),
      ])
      .optional(),
    createMany: z
      .lazy(() => ExamCreateManyCurriculumInputEnvelopeObjectSchema)
      .optional(),
    connect: z
      .union([
        z.lazy(() => ExamWhereUniqueInputObjectSchema),
        z.lazy(() => ExamWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict()

export const ExamCreateNestedManyWithoutCurriculumInputObjectSchema = Schema
