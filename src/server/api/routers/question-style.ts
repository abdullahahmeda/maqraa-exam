import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import {
  applyQuestionStylesFilters,
  deleteQuestionStyles,
} from '~/services/question-style'
import { listQuestionStyleSchema } from '~/validation/backend/queries/question-style/list'
import { applyPagination } from '~/utils/db'
import { getQuestionStylyeSchema } from '~/validation/backend/queries/question-style/get'
import { createQuestionStyleSchema } from '~/validation/backend/mutations/question-style/create'
import { updateQuestionStyleSchema } from '~/validation/backend/mutations/question-style/update'

export const questionStyleRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listQuestionStyleSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyQuestionStylesFilters(input?.filters)
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

  create: protectedProcedure
    .input(createQuestionStyleSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('QuestionStyle')
        .values({
          ...input,
          choicesColumns: input.type === 'MCQ' ? input.choicesColumns : [],
        })
        .execute()
      return true
    }),

  update: protectedProcedure
    .input(updateQuestionStyleSchema)
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
      await deleteQuestionStyles(input)
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

      await deleteQuestionStyles(input)
      return true
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteQuestionStyles(undefined)
    return true
  }),
})
