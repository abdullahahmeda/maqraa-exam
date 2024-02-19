import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/db'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { editQuestionStyleSchema } from '~/validation/editQuestionStyleSchema'
import { applyPagination, paginationSchema } from '~/utils/db'
import { QuestionStyleService } from '~/services/question-style'

export const questionStyleRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const questionStyleService = new QuestionStyleService(ctx.db)
      const count = await questionStyleService.getCount()

      let query = await questionStyleService.getListQuery()
      if (input?.pagination) {
        const { pageSize, pageIndex } = input.pagination
        query = query.limit(pageSize).offset(pageIndex * pageSize)
      }
      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
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
    const questionStyleService = new QuestionStyleService(ctx.db)
    return questionStyleService.getCount()
  }),

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
