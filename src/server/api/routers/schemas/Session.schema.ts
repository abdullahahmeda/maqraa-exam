/* eslint-disable */
import { z } from 'zod'
import { SessionSelectObjectSchema } from './objects/SessionSelect.schema'
import { SessionIncludeObjectSchema } from './objects/SessionInclude.schema'
import { SessionWhereUniqueInputObjectSchema } from './objects/SessionWhereUniqueInput.schema'
import { SessionWhereInputObjectSchema } from './objects/SessionWhereInput.schema'
import { SessionOrderByWithRelationInputObjectSchema } from './objects/SessionOrderByWithRelationInput.schema'
import { SessionScalarFieldEnumSchema } from './enums/SessionScalarFieldEnum.schema'
import { SessionCreateInputObjectSchema } from './objects/SessionCreateInput.schema'
import { SessionCreateManyInputObjectSchema } from './objects/SessionCreateManyInput.schema'
import { SessionUpdateInputObjectSchema } from './objects/SessionUpdateInput.schema'
import { SessionUpdateManyMutationInputObjectSchema } from './objects/SessionUpdateManyMutationInput.schema'
import { SessionCountAggregateInputObjectSchema } from './objects/SessionCountAggregateInput.schema'
import { SessionMinAggregateInputObjectSchema } from './objects/SessionMinAggregateInput.schema'
import { SessionMaxAggregateInputObjectSchema } from './objects/SessionMaxAggregateInput.schema'
import { SessionOrderByWithAggregationInputObjectSchema } from './objects/SessionOrderByWithAggregationInput.schema'
import { SessionScalarWhereWithAggregatesInputObjectSchema } from './objects/SessionScalarWhereWithAggregatesInput.schema'

export const SessionSchema = {
  findUnique: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    where: SessionWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    where: SessionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SessionOrderByWithRelationInputObjectSchema,
        SessionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SessionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(SessionScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    where: SessionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SessionOrderByWithRelationInputObjectSchema,
        SessionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SessionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(SessionScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    data: SessionCreateInputObjectSchema,
  }),
  createMany: z.object({ data: SessionCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    where: SessionWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: SessionWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    data: SessionUpdateInputObjectSchema,
    where: SessionWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: SessionUpdateManyMutationInputObjectSchema,
    where: SessionWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => SessionSelectObjectSchema.optional()),
    include: z.lazy(() => SessionIncludeObjectSchema.optional()),
    where: SessionWhereUniqueInputObjectSchema,
    create: SessionCreateInputObjectSchema,
    update: SessionUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: SessionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SessionOrderByWithRelationInputObjectSchema,
        SessionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SessionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), SessionCountAggregateInputObjectSchema])
      .optional(),
    _min: SessionMinAggregateInputObjectSchema.optional(),
    _max: SessionMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: SessionWhereInputObjectSchema.optional(),
    orderBy: z.union([
      SessionOrderByWithAggregationInputObjectSchema,
      SessionOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: SessionScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(SessionScalarFieldEnumSchema),
  }),
}
