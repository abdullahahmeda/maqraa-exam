/* eslint-disable */
import { z } from 'zod'
import { ExamQuestionSelectObjectSchema } from './objects/ExamQuestionSelect.schema'
import { ExamQuestionIncludeObjectSchema } from './objects/ExamQuestionInclude.schema'
import { ExamQuestionWhereUniqueInputObjectSchema } from './objects/ExamQuestionWhereUniqueInput.schema'
import { ExamQuestionWhereInputObjectSchema } from './objects/ExamQuestionWhereInput.schema'
import { ExamQuestionOrderByWithRelationInputObjectSchema } from './objects/ExamQuestionOrderByWithRelationInput.schema'
import { ExamQuestionScalarFieldEnumSchema } from './enums/ExamQuestionScalarFieldEnum.schema'
import { ExamQuestionCreateInputObjectSchema } from './objects/ExamQuestionCreateInput.schema'
import { ExamQuestionCreateManyInputObjectSchema } from './objects/ExamQuestionCreateManyInput.schema'
import { ExamQuestionUpdateInputObjectSchema } from './objects/ExamQuestionUpdateInput.schema'
import { ExamQuestionUpdateManyMutationInputObjectSchema } from './objects/ExamQuestionUpdateManyMutationInput.schema'
import { ExamQuestionCountAggregateInputObjectSchema } from './objects/ExamQuestionCountAggregateInput.schema'
import { ExamQuestionMinAggregateInputObjectSchema } from './objects/ExamQuestionMinAggregateInput.schema'
import { ExamQuestionMaxAggregateInputObjectSchema } from './objects/ExamQuestionMaxAggregateInput.schema'
import { ExamQuestionOrderByWithAggregationInputObjectSchema } from './objects/ExamQuestionOrderByWithAggregationInput.schema'
import { ExamQuestionScalarWhereWithAggregatesInputObjectSchema } from './objects/ExamQuestionScalarWhereWithAggregatesInput.schema'

export const ExamQuestionSchema = {
  findUnique: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    where: ExamQuestionWhereUniqueInputObjectSchema,
  }),
  findFirst: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    where: ExamQuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamQuestionOrderByWithRelationInputObjectSchema,
        ExamQuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamQuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(ExamQuestionScalarFieldEnumSchema).optional(),
  }),
  findMany: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    where: ExamQuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamQuestionOrderByWithRelationInputObjectSchema,
        ExamQuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamQuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.array(ExamQuestionScalarFieldEnumSchema).optional(),
  }),
  create: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    data: ExamQuestionCreateInputObjectSchema,
  }),
  createMany: z.object({ data: ExamQuestionCreateManyInputObjectSchema }),
  delete: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    where: ExamQuestionWhereUniqueInputObjectSchema,
  }),
  deleteMany: z.object({
    where: ExamQuestionWhereInputObjectSchema.optional(),
  }),
  update: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    data: ExamQuestionUpdateInputObjectSchema,
    where: ExamQuestionWhereUniqueInputObjectSchema,
  }),
  updateMany: z.object({
    data: ExamQuestionUpdateManyMutationInputObjectSchema,
    where: ExamQuestionWhereInputObjectSchema.optional(),
  }),
  upsert: z.object({
    select: z.lazy(() => ExamQuestionSelectObjectSchema.optional()),
    include: z.lazy(() => ExamQuestionIncludeObjectSchema.optional()),
    where: ExamQuestionWhereUniqueInputObjectSchema,
    create: ExamQuestionCreateInputObjectSchema,
    update: ExamQuestionUpdateInputObjectSchema,
  }),
  aggregate: z.object({
    where: ExamQuestionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        ExamQuestionOrderByWithRelationInputObjectSchema,
        ExamQuestionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    cursor: ExamQuestionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), ExamQuestionCountAggregateInputObjectSchema])
      .optional(),
    _min: ExamQuestionMinAggregateInputObjectSchema.optional(),
    _max: ExamQuestionMaxAggregateInputObjectSchema.optional(),
  }),
  groupBy: z.object({
    where: ExamQuestionWhereInputObjectSchema.optional(),
    orderBy: z.union([
      ExamQuestionOrderByWithAggregationInputObjectSchema,
      ExamQuestionOrderByWithAggregationInputObjectSchema.array(),
    ]),
    having: ExamQuestionScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(ExamQuestionScalarFieldEnumSchema),
  }),
}
