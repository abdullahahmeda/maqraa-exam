/* eslint-disable */
import { z } from 'zod'
import { SettingSelectObjectSchema } from './objects/SettingSelect.schema'
import { SettingWhereUniqueInputObjectSchema } from './objects/SettingWhereUniqueInput.schema'
import { SettingWhereInputObjectSchema } from './objects/SettingWhereInput.schema'
import { SettingOrderByWithRelationInputObjectSchema } from './objects/SettingOrderByWithRelationInput.schema'
import { SettingScalarFieldEnumSchema } from './enums/SettingScalarFieldEnum.schema'
import { SettingCreateInputObjectSchema } from './objects/SettingCreateInput.schema'
import { SettingCreateManyInputObjectSchema } from './objects/SettingCreateManyInput.schema'
import { SettingUpdateInputObjectSchema } from './objects/SettingUpdateInput.schema'
import { SettingUpdateManyMutationInputObjectSchema } from './objects/SettingUpdateManyMutationInput.schema'
import { SettingCountAggregateInputObjectSchema } from './objects/SettingCountAggregateInput.schema'
import { SettingMinAggregateInputObjectSchema } from './objects/SettingMinAggregateInput.schema'
import { SettingMaxAggregateInputObjectSchema } from './objects/SettingMaxAggregateInput.schema'
import { SettingOrderByWithAggregationInputObjectSchema } from './objects/SettingOrderByWithAggregationInput.schema'
import { SettingScalarWhereWithAggregatesInputObjectSchema } from './objects/SettingScalarWhereWithAggregatesInput.schema'

export const SettingSchema = {
  findUnique: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    where: SettingWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    where: SettingWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SettingOrderByWithRelationInputObjectSchema,
        SettingOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SettingWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(SettingScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    where: SettingWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SettingOrderByWithRelationInputObjectSchema,
        SettingOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SettingWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(SettingScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    data: SettingCreateInputObjectSchema,
  }),
  createMany: z.object({ data: SettingCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    where: SettingWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({ where: SettingWhereInputObjectSchema.optional() }),
  update: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    data: SettingUpdateInputObjectSchema,
    where: SettingWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: SettingUpdateManyMutationInputObjectSchema,
    where: SettingWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => SettingSelectObjectSchema.optional()),
    where: SettingWhereUniqueInputObjectSchema,
    create: SettingCreateInputObjectSchema,
    update: SettingUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: SettingWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        SettingOrderByWithRelationInputObjectSchema,
        SettingOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: SettingWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), SettingCountAggregateInputObjectSchema])
      .optional(),
    _min: SettingMinAggregateInputObjectSchema.optional(),
    _max: SettingMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: SettingWhereInputObjectSchema.optional(),
    orderBy: z.union([
      SettingOrderByWithAggregationInputObjectSchema,
      SettingOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: SettingScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(SettingScalarFieldEnumSchema),
  }),
}
