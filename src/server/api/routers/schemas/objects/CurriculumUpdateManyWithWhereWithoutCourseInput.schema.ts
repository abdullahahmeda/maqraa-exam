/* eslint-disable */
import { z } from 'zod'
import { CurriculumScalarWhereInputObjectSchema } from './CurriculumScalarWhereInput.schema'
import { CurriculumUpdateManyMutationInputObjectSchema } from './CurriculumUpdateManyMutationInput.schema'
import { CurriculumUncheckedUpdateManyWithoutCurriculaInputObjectSchema } from './CurriculumUncheckedUpdateManyWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<
    Prisma.CurriculumUpdateManyWithWhereWithoutCourseInput,
    'zenstack_transaction' | 'zenstack_guard'
  >
> = z
  .object({
    where: z.lazy(() => CurriculumScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => CurriculumUpdateManyMutationInputObjectSchema),
      z.lazy(
        () => CurriculumUncheckedUpdateManyWithoutCurriculaInputObjectSchema
      ),
    ]),
  })
  .strict()

export const CurriculumUpdateManyWithWhereWithoutCourseInputObjectSchema =
  Schema
