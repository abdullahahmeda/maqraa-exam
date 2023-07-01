/* eslint-disable */
import { z } from 'zod'
import { TrackCreateNestedOneWithoutCurriculaInputObjectSchema } from './TrackCreateNestedOneWithoutCurriculaInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.CurriculumCreateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    fromPage: z.number(),
    toPage: z.number(),
    track: z.lazy(() => TrackCreateNestedOneWithoutCurriculaInputObjectSchema),
  })
  .strict()

export const CurriculumCreateInputObjectSchema = Schema
