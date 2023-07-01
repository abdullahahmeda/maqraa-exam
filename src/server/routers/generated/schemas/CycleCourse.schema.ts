/* eslint-disable */
import { z } from 'zod'
import { CycleCourseSelectObjectSchema } from './objects/CycleCourseSelect.schema'
import { CycleCourseIncludeObjectSchema } from './objects/CycleCourseInclude.schema'
import { CycleCourseWhereUniqueInputObjectSchema } from './objects/CycleCourseWhereUniqueInput.schema'
import { CycleCourseWhereInputObjectSchema } from './objects/CycleCourseWhereInput.schema'
import { CycleCourseOrderByWithRelationInputObjectSchema } from './objects/CycleCourseOrderByWithRelationInput.schema'
import { CycleCourseScalarFieldEnumSchema } from './enums/CycleCourseScalarFieldEnum.schema'
import { CycleCourseCreateInputObjectSchema } from './objects/CycleCourseCreateInput.schema'
import { CycleCourseCreateManyInputObjectSchema } from './objects/CycleCourseCreateManyInput.schema'
import { CycleCourseUpdateInputObjectSchema } from './objects/CycleCourseUpdateInput.schema'
import { CycleCourseUpdateManyMutationInputObjectSchema } from './objects/CycleCourseUpdateManyMutationInput.schema'
import { CycleCourseCountAggregateInputObjectSchema } from './objects/CycleCourseCountAggregateInput.schema'
import { CycleCourseMinAggregateInputObjectSchema } from './objects/CycleCourseMinAggregateInput.schema'
import { CycleCourseMaxAggregateInputObjectSchema } from './objects/CycleCourseMaxAggregateInput.schema'
import { CycleCourseAvgAggregateInputObjectSchema } from './objects/CycleCourseAvgAggregateInput.schema'
import { CycleCourseSumAggregateInputObjectSchema } from './objects/CycleCourseSumAggregateInput.schema'
import { CycleCourseOrderByWithAggregationInputObjectSchema } from './objects/CycleCourseOrderByWithAggregationInput.schema'
import { CycleCourseScalarWhereWithAggregatesInputObjectSchema } from './objects/CycleCourseScalarWhereWithAggregatesInput.schema'

export const CycleCourseSchema = {
  findUnique: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    where: CycleCourseWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    where: CycleCourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleCourseOrderByWithRelationInputObjectSchema,
        CycleCourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleCourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CycleCourseScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    where: CycleCourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleCourseOrderByWithRelationInputObjectSchema,
        CycleCourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleCourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CycleCourseScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    data: CycleCourseCreateInputObjectSchema,
  }),
  createMany: z.object({ data: CycleCourseCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    where: CycleCourseWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: CycleCourseWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    data: CycleCourseUpdateInputObjectSchema,
    where: CycleCourseWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: CycleCourseUpdateManyMutationInputObjectSchema,
    where: CycleCourseWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => CycleCourseSelectObjectSchema.optional()),
    include: z.lazy(() => CycleCourseIncludeObjectSchema.optional()),
    where: CycleCourseWhereUniqueInputObjectSchema,
    create: CycleCourseCreateInputObjectSchema,
    update: CycleCourseUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: CycleCourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CycleCourseOrderByWithRelationInputObjectSchema,
        CycleCourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CycleCourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), CycleCourseCountAggregateInputObjectSchema])
      .optional(),
    _min: CycleCourseMinAggregateInputObjectSchema.optional(),
    _max: CycleCourseMaxAggregateInputObjectSchema.optional(),
    _avg: CycleCourseAvgAggregateInputObjectSchema.optional(),
    _sum: CycleCourseSumAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: CycleCourseWhereInputObjectSchema.optional(),
    orderBy: z.union([
      CycleCourseOrderByWithAggregationInputObjectSchema,
      CycleCourseOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: CycleCourseScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(CycleCourseScalarFieldEnumSchema),
  }),
}
