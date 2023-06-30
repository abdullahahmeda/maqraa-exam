/* eslint-disable */
import { z } from 'zod'
import { VerificationTokenSelectObjectSchema } from './objects/VerificationTokenSelect.schema'
import { VerificationTokenWhereUniqueInputObjectSchema } from './objects/VerificationTokenWhereUniqueInput.schema'
import { VerificationTokenWhereInputObjectSchema } from './objects/VerificationTokenWhereInput.schema'
import { VerificationTokenOrderByWithRelationInputObjectSchema } from './objects/VerificationTokenOrderByWithRelationInput.schema'
import { VerificationTokenScalarFieldEnumSchema } from './enums/VerificationTokenScalarFieldEnum.schema'
import { VerificationTokenCreateInputObjectSchema } from './objects/VerificationTokenCreateInput.schema'
import { VerificationTokenCreateManyInputObjectSchema } from './objects/VerificationTokenCreateManyInput.schema'
import { VerificationTokenUpdateInputObjectSchema } from './objects/VerificationTokenUpdateInput.schema'
import { VerificationTokenUpdateManyMutationInputObjectSchema } from './objects/VerificationTokenUpdateManyMutationInput.schema'
import { VerificationTokenCountAggregateInputObjectSchema } from './objects/VerificationTokenCountAggregateInput.schema'
import { VerificationTokenMinAggregateInputObjectSchema } from './objects/VerificationTokenMinAggregateInput.schema'
import { VerificationTokenMaxAggregateInputObjectSchema } from './objects/VerificationTokenMaxAggregateInput.schema'
import { VerificationTokenOrderByWithAggregationInputObjectSchema } from './objects/VerificationTokenOrderByWithAggregationInput.schema'
import { VerificationTokenScalarWhereWithAggregatesInputObjectSchema } from './objects/VerificationTokenScalarWhereWithAggregatesInput.schema'

export const VerificationTokenSchema = {
  findUnique: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    where: VerificationTokenWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    where: VerificationTokenWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        VerificationTokenOrderByWithRelationInputObjectSchema,
        VerificationTokenOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: VerificationTokenWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(VerificationTokenScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    where: VerificationTokenWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        VerificationTokenOrderByWithRelationInputObjectSchema,
        VerificationTokenOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: VerificationTokenWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(VerificationTokenScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    data: VerificationTokenCreateInputObjectSchema,
  }),
  createMany: z.object({ data: VerificationTokenCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    where: VerificationTokenWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({
    where: VerificationTokenWhereInputObjectSchema.optional(),
  }),
  update: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    data: VerificationTokenUpdateInputObjectSchema,
    where: VerificationTokenWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: VerificationTokenUpdateManyMutationInputObjectSchema,
    where: VerificationTokenWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => VerificationTokenSelectObjectSchema.optional()),
    where: VerificationTokenWhereUniqueInputObjectSchema,
    create: VerificationTokenCreateInputObjectSchema,
    update: VerificationTokenUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: VerificationTokenWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        VerificationTokenOrderByWithRelationInputObjectSchema,
        VerificationTokenOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: VerificationTokenWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([
        z.literal(true),
        VerificationTokenCountAggregateInputObjectSchema,
      ])
      .optional(),
    _min: VerificationTokenMinAggregateInputObjectSchema.optional(),
    _max: VerificationTokenMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: VerificationTokenWhereInputObjectSchema.optional(),
    orderBy: z.union([
      VerificationTokenOrderByWithAggregationInputObjectSchema,
      VerificationTokenOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having:
      VerificationTokenScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(VerificationTokenScalarFieldEnumSchema),
  }),
}
