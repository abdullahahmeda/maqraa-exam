import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { editQuestionStyleSchema } from '~/validation/editQuestionStyleSchema'
import { applyPagination, paginationSchema } from '~/utils/db'

export const questionStyleRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = applyPagination(
        ctx.db.selectFrom('QuestionStyle').selectAll(),
        input.pagination
      )
      return await query.execute()
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) =>
      ctx.db
        .selectFrom('QuestionStyle')
        .selectAll()
        .where('id', '=', input)
        .executeTakeFirst()
    ),

  count: protectedProcedure.query(async ({ ctx, input }) => {
    const query = ctx.db
      .selectFrom('QuestionStyle')
      .select(({ fn }) => fn.count('id').as('total'))

    const total = Number((await query.executeTakeFirst())?.total)
    return total
  }),

  create: protectedProcedure
    .input(newQuestionStyleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await db
          .insertInto('QuestionStyle')
          .values(input as any)
          .execute()
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ أثناء إضافة نوع السؤال',
        })
      }
      return true
    }),

  update: protectedProcedure
    .input(editQuestionStyleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      try {
        await db
          .updateTable('QuestionStyle')
          .set(input)
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
      await ctx.db.deleteFrom('QuestionStyle').where('id', '=', input).execute()
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

      await ctx.db
        .deleteFrom('QuestionStyle')
        .where('id', 'in', input)
        .execute()
      return true
    }),
})
