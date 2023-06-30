/* eslint-disable */
import { z } from 'zod'
import { CourseSelectObjectSchema } from './objects/CourseSelect.schema'
import { CourseIncludeObjectSchema } from './objects/CourseInclude.schema'
import { CourseWhereUniqueInputObjectSchema } from './objects/CourseWhereUniqueInput.schema'
import { CourseWhereInputObjectSchema } from './objects/CourseWhereInput.schema'
import { CourseOrderByWithRelationInputObjectSchema } from './objects/CourseOrderByWithRelationInput.schema'
import { CourseScalarFieldEnumSchema } from './enums/CourseScalarFieldEnum.schema'
import { CourseCreateInputObjectSchema } from './objects/CourseCreateInput.schema'
import { CourseCreateManyInputObjectSchema } from './objects/CourseCreateManyInput.schema'
import { CourseUpdateInputObjectSchema } from './objects/CourseUpdateInput.schema'
import { CourseUpdateManyMutationInputObjectSchema } from './objects/CourseUpdateManyMutationInput.schema'
import { CourseCountAggregateInputObjectSchema } from './objects/CourseCountAggregateInput.schema'
import { CourseMinAggregateInputObjectSchema } from './objects/CourseMinAggregateInput.schema'
import { CourseMaxAggregateInputObjectSchema } from './objects/CourseMaxAggregateInput.schema'
import { CourseOrderByWithAggregationInputObjectSchema } from './objects/CourseOrderByWithAggregationInput.schema'
import { CourseScalarWhereWithAggregatesInputObjectSchema } from './objects/CourseScalarWhereWithAggregatesInput.schema'

export const CourseSchema = {
  findUnique: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    where: CourseWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    where: CourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CourseOrderByWithRelationInputObjectSchema,
        CourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CourseScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    where: CourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CourseOrderByWithRelationInputObjectSchema,
        CourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(CourseScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    data: CourseCreateInputObjectSchema,
  }),
  createMany: z.object({ data: CourseCreateManyInputObjectSchema }),
  count: z.object({
    where: CourseWhereInputObjectSchema.optional(),
  }),
  delete: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    where: CourseWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: CourseWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    data: CourseUpdateInputObjectSchema,
    where: CourseWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: CourseUpdateManyMutationInputObjectSchema,
    where: CourseWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => CourseSelectObjectSchema.optional()),
    include: z.lazy(() => CourseIncludeObjectSchema.optional()),
    where: CourseWhereUniqueInputObjectSchema,
    create: CourseCreateInputObjectSchema,
    update: CourseUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: CourseWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        CourseOrderByWithRelationInputObjectSchema,
        CourseOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: CourseWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), CourseCountAggregateInputObjectSchema])
      .optional(),
    _min: CourseMinAggregateInputObjectSchema.optional(),
    _max: CourseMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: CourseWhereInputObjectSchema.optional(),
    orderBy: z.union([
      CourseOrderByWithAggregationInputObjectSchema,
      CourseOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: CourseScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(CourseScalarFieldEnumSchema),
  }),
}
