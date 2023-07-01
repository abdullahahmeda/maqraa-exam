/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionScalarWhereInputObjectSchema } from './ExamQuestionScalarWhereInput.schema'
import { ExamQuestionUpdateManyMutationInputObjectSchema } from './ExamQuestionUpdateManyMutationInput.schema'
import { ExamQuestionUncheckedUpdateManyWithoutExamsInputObjectSchema } from './ExamQuestionUncheckedUpdateManyWithoutExamsInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.ExamQuestionUpdateManyWithWhereWithoutQuestionInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => ExamQuestionScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => ExamQuestionUpdateManyMutationInputObjectSchema),
      z.lazy(
        () => ExamQuestionUncheckedUpdateManyWithoutExamsInputObjectSchema
      ),
    ]),
  })
  .strict()

export const ExamQuestionUpdateManyWithWhereWithoutQuestionInputObjectSchema =
  Schema
