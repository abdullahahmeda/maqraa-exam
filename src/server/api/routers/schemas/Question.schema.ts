/* eslint-disable */
import { z } from 'zod'
import { QuestionSelectObjectSchema } from './objects/QuestionSelect.schema'
import { QuestionIncludeObjectSchema } from './objects/QuestionInclude.schema'
import { QuestionWhereUniqueInputObjectSchema } from './objects/QuestionWhereUniqueInput.schema'
import { QuestionWhereInputObjectSchema } from './objects/QuestionWhereInput.schema'
import { QuestionOrderByWithRelationInputObjectSchema } from './objects/QuestionOrderByWithRelationInput.schema'
import { QuestionScalarFieldEnumSchema } from './enums/QuestionScalarFieldEnum.schema'
import { QuestionCreateInputObjectSchema } from './objects/QuestionCreateInput.schema'
import { QuestionCreateManyInputObjectSchema } from './objects/QuestionCreateManyInput.schema'
import { QuestionUpdateInputObjectSchema } from './objects/QuestionUpdateInput.schema'
import { QuestionUpdateManyMutationInputObjectSchema } from './objects/QuestionUpdateManyMutationInput.schema'
import { QuestionCountAggregateInputObjectSchema } from './objects/QuestionCountAggregateInput.schema'
import { QuestionMinAggregateInputObjectSchema } from './objects/QuestionMinAggregateInput.schema'
import { QuestionMaxAggregateInputObjectSchema } from './objects/QuestionMaxAggregateInput.schema'
import { QuestionAvgAggregateInputObjectSchema } from './objects/QuestionAvgAggregateInput.schema'
import { QuestionSumAggregateInputObjectSchema } from './objects/QuestionSumAggregateInput.schema'
import { QuestionOrderByWithAggregationInputObjectSchema } from './objects/QuestionOrderByWithAggregationInput.schema'
import { QuestionScalarWhereWithAggregatesInputObjectSchema } from './objects/QuestionScalarWhereWithAggregatesInput.schema'

export const QuestionSchema = {
  findUnique: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    where: QuestionWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    where: QuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        QuestionOrderByWithRelationInputObjectSchema,
        QuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: QuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(QuestionScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    where: QuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        QuestionOrderByWithRelationInputObjectSchema,
        QuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: QuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(QuestionScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    data: QuestionCreateInputObjectSchema,
  }),
  createMany: z.object({ data: QuestionCreateManyInputObjectSchema }),
  count: z.object({
    where: QuestionWhereInputObjectSchema.optional(),
  }),
  delete: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    where: QuestionWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: QuestionWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    data: QuestionUpdateInputObjectSchema,
    where: QuestionWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: QuestionUpdateManyMutationInputObjectSchema,
    where: QuestionWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => QuestionSelectObjectSchema.optional()),
    include: z.lazy(() => QuestionIncludeObjectSchema.optional()),
    where: QuestionWhereUniqueInputObjectSchema,
    create: QuestionCreateInputObjectSchema,
    update: QuestionUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: QuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        QuestionOrderByWithRelationInputObjectSchema,
        QuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: QuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), QuestionCountAggregateInputObjectSchema])
      .optional(),
    _min: QuestionMinAggregateInputObjectSchema.optional(),
    _max: QuestionMaxAggregateInputObjectSchema.optional(),
    _avg: QuestionAvgAggregateInputObjectSchema.optional(),
    _sum: QuestionSumAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: QuestionWhereInputObjectSchema.optional(),
    orderBy: z.union([
      QuestionOrderByWithAggregationInputObjectSchema,
      QuestionOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: QuestionScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(QuestionScalarFieldEnumSchema),
  }),
}
