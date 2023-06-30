/* eslint-disable */
import { z } from 'zod'
import { ExamSelectObjectSchema } from './objects/ExamSelect.schema'
import { ExamIncludeObjectSchema } from './objects/ExamInclude.schema'
import { ExamWhereUniqueInputObjectSchema } from './objects/ExamWhereUniqueInput.schema'
import { ExamWhereInputObjectSchema } from './objects/ExamWhereInput.schema'
import { ExamOrderByWithRelationInputObjectSchema } from './objects/ExamOrderByWithRelationInput.schema'
import { ExamScalarFieldEnumSchema } from './enums/ExamScalarFieldEnum.schema'
import { ExamCreateInputObjectSchema } from './objects/ExamCreateInput.schema'
import { ExamCreateManyInputObjectSchema } from './objects/ExamCreateManyInput.schema'
import { ExamUpdateInputObjectSchema } from './objects/ExamUpdateInput.schema'
import { ExamUpdateManyMutationInputObjectSchema } from './objects/ExamUpdateManyMutationInput.schema'
import { ExamCountAggregateInputObjectSchema } from './objects/ExamCountAggregateInput.schema'
import { ExamMinAggregateInputObjectSchema } from './objects/ExamMinAggregateInput.schema'
import { ExamMaxAggregateInputObjectSchema } from './objects/ExamMaxAggregateInput.schema'
import { ExamAvgAggregateInputObjectSchema } from './objects/ExamAvgAggregateInput.schema'
import { ExamSumAggregateInputObjectSchema } from './objects/ExamSumAggregateInput.schema'
import { ExamOrderByWithAggregationInputObjectSchema } from './objects/ExamOrderByWithAggregationInput.schema'
import { ExamScalarWhereWithAggregatesInputObjectSchema } from './objects/ExamScalarWhereWithAggregatesInput.schema'

export const ExamSchema = {
  findUnique: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    where: ExamWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    where: ExamWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamOrderByWithRelationInputObjectSchema,
        ExamOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(ExamScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    where: ExamWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamOrderByWithRelationInputObjectSchema,
        ExamOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(ExamScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    data: ExamCreateInputObjectSchema,
  }),
  createMany: z.object({ data: ExamCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    where: ExamWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: ExamWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    data: ExamUpdateInputObjectSchema,
    where: ExamWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: ExamUpdateManyMutationInputObjectSchema,
    where: ExamWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => ExamSelectObjectSchema.optional()),
    include: z.lazy(() => ExamIncludeObjectSchema.optional()),
    where: ExamWhereUniqueInputObjectSchema,
    create: ExamCreateInputObjectSchema,
    update: ExamUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: ExamWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamOrderByWithRelationInputObjectSchema,
        ExamOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), ExamCountAggregateInputObjectSchema])
      .optional(),
    _min: ExamMinAggregateInputObjectSchema.optional(),
    _max: ExamMaxAggregateInputObjectSchema.optional(),
    _avg: ExamAvgAggregateInputObjectSchema.optional(),
    _sum: ExamSumAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: ExamWhereInputObjectSchema.optional(),
    orderBy: z.union([
      ExamOrderByWithAggregationInputObjectSchema,
      ExamOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: ExamScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(ExamScalarFieldEnumSchema),
  }),
}
