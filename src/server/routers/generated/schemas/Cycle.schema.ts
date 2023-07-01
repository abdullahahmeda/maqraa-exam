/* eslint-disable */
import { z } from 'zod'
import { CycleSelectObjectSchema } from './objects/CycleSelect.schema'
import { CycleIncludeObjectSchema } from './objects/CycleInclude.schema'
import { CycleWhereUniqueInputObjectSchema } from './objects/CycleWhereUniqueInput.schema'
import { CycleWhereInputObjectSchema } from './objects/CycleWhereInput.schema'
import { CycleOrderByWithRelationInputObjectSchema } from './objects/CycleOrderByWithRelationInput.schema'
import { CycleScalarFieldEnumSchema } from './enums/CycleScalarFieldEnum.schema'
import { CycleCreateInputObjectSchema } from './objects/CycleCreateInput.schema'
import { CycleCreateManyInputObjectSchema } from './objects/CycleCreateManyInput.schema'
import { CycleUpdateInputObjectSchema } from './objects/CycleUpdateInput.schema'
import { CycleUpdateManyMutationInputObjectSchema } from './objects/CycleUpdateManyMutationInput.schema'
import { CycleCountAggregateInputObjectSchema } from './objects/CycleCountAggregateInput.schema'
import { CycleMinAggregateInputObjectSchema } from './objects/CycleMinAggregateInput.schema'
import { CycleMaxAggregateInputObjectSchema } from './objects/CycleMaxAggregateInput.schema'
import { CycleOrderByWithAggregationInputObjectSchema } from './objects/CycleOrderByWithAggregationInput.schema'
import { CycleScalarWhereWithAggregatesInputObjectSchema } from './objects/CycleScalarWhereWithAggregatesInput.schema'

export const CycleSchema = {
  findUnique: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    where: CycleWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    where: CycleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleOrderByWithRelationInputObjectSchema,
        CycleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CycleScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    where: CycleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleOrderByWithRelationInputObjectSchema,
        CycleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CycleScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    data: CycleCreateInputObjectSchema,
  }),
  createMany: z.object({ data: CycleCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    where: CycleWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: CycleWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    data: CycleUpdateInputObjectSchema,
    where: CycleWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: CycleUpdateManyMutationInputObjectSchema,
    where: CycleWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => CycleSelectObjectSchema.optional()),
    include: z.lazy(() => CycleIncludeObjectSchema.optional()),
    where: CycleWhereUniqueInputObjectSchema,
    create: CycleCreateInputObjectSchema,
    update: CycleUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: CycleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleOrderByWithRelationInputObjectSchema,
        CycleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), CycleCountAggregateInputObjectSchema])
      .optional(),
    _min: CycleMinAggregateInputObjectSchema.optional(),
    _max: CycleMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: CycleWhereInputObjectSchema.optional(),
    orderBy: z.union([
      CycleOrderByWithAggregationInputObjectSchema,
      CycleOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: CycleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(CycleScalarFieldEnumSchema),
  }),
}
