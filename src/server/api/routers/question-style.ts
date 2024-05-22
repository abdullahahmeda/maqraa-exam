import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { editQuestionStyleSchema } from '~/validation/editQuestionStyleSchema'
import { QuestionStyleService } from '~/services/question-style'
import { listQuestionStyleSchema } from '~/validation/backend/queries/question-style/list'
import { applyPagination } from '~/utils/db'
import { getQuestionStylyeSchema } from '~/validation/backend/queries/question-style/get'
import { type FiltersSchema } from '~/validation/backend/queries/question-style/common'
import { type SqlBool, type Expression, type ExpressionBuilder } from 'kysely'
import type { DB } from '~/kysely/types'

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'QuestionStyle'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    if (filters?.type) where.push(eb('type', '=', filters.type))
    return eb.and(where)
  }
}

export const questionStyleRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listQuestionStyleSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyFilters(input?.filters)
      const count = Number(
        (
          await ctx.db
            .selectFrom('QuestionStyle')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db.selectFrom('QuestionStyle').selectAll().where(where),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  get: protectedProcedure
    .input(getQuestionStylyeSchema)
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('QuestionStyle')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst(),
    ),

  // count: protectedProcedure.query(async ({ ctx, input }) => {
  //   const questionStyleService = new QuestionStyleService(ctx.db)
  //   return questionStyleService.getCount()
  // }),

  create: protectedProcedure
    .input(newQuestionStyleSchema)
    .mutation(async ({ ctx, input }) => {
      const questionStyleService = new QuestionStyleService(ctx.db)
      await questionStyleService.create(input)
      return true
    }),

  update: protectedProcedure
    .input(editQuestionStyleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      try {
        await ctx.db
          .updateTable('QuestionStyle')
          .set(data)
          .where('id', '=', id)
          .execute()
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ أثناء إضافة نوع السؤال',
        })
      }
      return true
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      const questionStyleService = new QuestionStyleService(ctx.db)
      await questionStyleService.delete(input)
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const questionStyleService = new QuestionStyleService(ctx.db)
      await questionStyleService.delete(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    const questionStyleService = new QuestionStyleService(ctx.db)
    await questionStyleService.delete(undefined)
    return true
  }),
})
