/* eslint-disable */
import { z } from 'zod'
import { TrackSelectObjectSchema } from './objects/TrackSelect.schema'
import { TrackIncludeObjectSchema } from './objects/TrackInclude.schema'
import { TrackWhereUniqueInputObjectSchema } from './objects/TrackWhereUniqueInput.schema'
import { TrackWhereInputObjectSchema } from './objects/TrackWhereInput.schema'
import { TrackOrderByWithRelationInputObjectSchema } from './objects/TrackOrderByWithRelationInput.schema'
import { TrackScalarFieldEnumSchema } from './enums/TrackScalarFieldEnum.schema'
import { TrackCreateInputObjectSchema } from './objects/TrackCreateInput.schema'
import { TrackCreateManyInputObjectSchema } from './objects/TrackCreateManyInput.schema'
import { TrackUpdateInputObjectSchema } from './objects/TrackUpdateInput.schema'
import { TrackUpdateManyMutationInputObjectSchema } from './objects/TrackUpdateManyMutationInput.schema'
import { TrackCountAggregateInputObjectSchema } from './objects/TrackCountAggregateInput.schema'
import { TrackMinAggregateInputObjectSchema } from './objects/TrackMinAggregateInput.schema'
import { TrackMaxAggregateInputObjectSchema } from './objects/TrackMaxAggregateInput.schema'
import { TrackOrderByWithAggregationInputObjectSchema } from './objects/TrackOrderByWithAggregationInput.schema'
import { TrackScalarWhereWithAggregatesInputObjectSchema } from './objects/TrackScalarWhereWithAggregatesInput.schema'

export const TrackSchema = {
  findUnique: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    where: TrackWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    where: TrackWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TrackOrderByWithRelationInputObjectSchema,
        TrackOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: TrackWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(TrackScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    where: TrackWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TrackOrderByWithRelationInputObjectSchema,
        TrackOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: TrackWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(TrackScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    data: TrackCreateInputObjectSchema,
  }),
  createMany: z.object({ data: TrackCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    where: TrackWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: TrackWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    data: TrackUpdateInputObjectSchema,
    where: TrackWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: TrackUpdateManyMutationInputObjectSchema,
    where: TrackWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => TrackSelectObjectSchema.optional()),
    include: z.lazy(() => TrackIncludeObjectSchema.optional()),
    where: TrackWhereUniqueInputObjectSchema,
    create: TrackCreateInputObjectSchema,
    update: TrackUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: TrackWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TrackOrderByWithRelationInputObjectSchema,
        TrackOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: TrackWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), TrackCountAggregateInputObjectSchema])
      .optional(),
    _min: TrackMinAggregateInputObjectSchema.optional(),
    _max: TrackMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: TrackWhereInputObjectSchema.optional(),
    orderBy: z.union([
      TrackOrderByWithAggregationInputObjectSchema,
      TrackOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: TrackScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(TrackScalarFieldEnumSchema),
  }),
}
