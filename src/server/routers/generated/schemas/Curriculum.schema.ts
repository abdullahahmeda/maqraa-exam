/* eslint-disable */
import { z } from 'zod'
import { CurriculumSelectObjectSchema } from './objects/CurriculumSelect.schema'
import { CurriculumIncludeObjectSchema } from './objects/CurriculumInclude.schema'
import { CurriculumWhereUniqueInputObjectSchema } from './objects/CurriculumWhereUniqueInput.schema'
import { CurriculumWhereInputObjectSchema } from './objects/CurriculumWhereInput.schema'
import { CurriculumOrderByWithRelationInputObjectSchema } from './objects/CurriculumOrderByWithRelationInput.schema'
import { CurriculumScalarFieldEnumSchema } from './enums/CurriculumScalarFieldEnum.schema'
import { CurriculumCreateInputObjectSchema } from './objects/CurriculumCreateInput.schema'
import { CurriculumCreateManyInputObjectSchema } from './objects/CurriculumCreateManyInput.schema'
import { CurriculumUpdateInputObjectSchema } from './objects/CurriculumUpdateInput.schema'
import { CurriculumUpdateManyMutationInputObjectSchema } from './objects/CurriculumUpdateManyMutationInput.schema'
import { CurriculumCountAggregateInputObjectSchema } from './objects/CurriculumCountAggregateInput.schema'
import { CurriculumMinAggregateInputObjectSchema } from './objects/CurriculumMinAggregateInput.schema'
import { CurriculumMaxAggregateInputObjectSchema } from './objects/CurriculumMaxAggregateInput.schema'
import { CurriculumAvgAggregateInputObjectSchema } from './objects/CurriculumAvgAggregateInput.schema'
import { CurriculumSumAggregateInputObjectSchema } from './objects/CurriculumSumAggregateInput.schema'
import { CurriculumOrderByWithAggregationInputObjectSchema } from './objects/CurriculumOrderByWithAggregationInput.schema'
import { CurriculumScalarWhereWithAggregatesInputObjectSchema } from './objects/CurriculumScalarWhereWithAggregatesInput.schema'

export const CurriculumSchema = {
  findUnique: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    where: CurriculumWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    where: CurriculumWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CurriculumOrderByWithRelationInputObjectSchema,
        CurriculumOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CurriculumWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CurriculumScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    where: CurriculumWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CurriculumOrderByWithRelationInputObjectSchema,
        CurriculumOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CurriculumWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CurriculumScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    data: CurriculumCreateInputObjectSchema,
  }),
  createMany: z.object({ data: CurriculumCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    where: CurriculumWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: CurriculumWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    data: CurriculumUpdateInputObjectSchema,
    where: CurriculumWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: CurriculumUpdateManyMutationInputObjectSchema,
    where: CurriculumWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => CurriculumSelectObjectSchema.optional()),
    include: z.lazy(() => CurriculumIncludeObjectSchema.optional()),
    where: CurriculumWhereUniqueInputObjectSchema,
    create: CurriculumCreateInputObjectSchema,
    update: CurriculumUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: CurriculumWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CurriculumOrderByWithRelationInputObjectSchema,
        CurriculumOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CurriculumWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), CurriculumCountAggregateInputObjectSchema])
      .optional(),
    _min: CurriculumMinAggregateInputObjectSchema.optional(),
    _max: CurriculumMaxAggregateInputObjectSchema.optional(),
    _avg: CurriculumAvgAggregateInputObjectSchema.optional(),
    _sum: CurriculumSumAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: CurriculumWhereInputObjectSchema.optional(),
    orderBy: z.union([
      CurriculumOrderByWithAggregationInputObjectSchema,
      CurriculumOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: CurriculumScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(CurriculumScalarFieldEnumSchema),
  }),
}
