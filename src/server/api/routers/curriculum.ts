import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { applyPagination } from '~/utils/db'
import { TRPCError } from '@trpc/server'
import { createCurriculumSchema } from '~/validation/backend/mutations/curriculum/create'
import { getCurriculumSchema } from '~/validation/backend/queries/curriculum/get'
import { listCurriculumSchema } from '~/validation/backend/queries/curriculum/list'
import { updateCurriculumSchema } from '~/validation/backend/mutations/curriculum/update'
import {
  applyCurriculaFilters,
  applyCurriculaInclude,
  deleteCurricula,
} from '~/services/curriculum'

export const curriculumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { parts, ...data } = input
      await ctx.db.transaction().execute(async (trx) => {
        const curriculum = await trx
          .insertInto('Curriculum')
          .values(data)
          .returning('id')
          .executeTakeFirst()

        for (const part of parts) {
          await trx
            .insertInto('CurriculumPart')
            .values({ ...part, curriculumId: curriculum!.id })
            .execute()
        }
      })
      return true
    }),

  get: protectedProcedure
    .input(getCurriculumSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db
        .selectFrom('Curriculum')
        .selectAll('Curriculum')
        .where('id', '=', input.id)
        .select(applyCurriculaInclude(input.include))
        .executeTakeFirst()
    }),

  list: publicProcedure
    .input(listCurriculumSchema.optional())
    .query(async ({ ctx, input }) => {
      const where = applyCurriculaFilters(input?.filters)

      const count = Number(
        (
          await ctx.db
            .selectFrom('Curriculum')
            .select(({ fn }) => fn.count<string>('id').as('count'))
            .where(where)
            .executeTakeFirstOrThrow()
        ).count,
      )

      const query = applyPagination(
        ctx.db
          .selectFrom('Curriculum')
          .selectAll()
          .where(where)
          .select(applyCurriculaInclude(input?.include)),
        input?.pagination,
      )

      const rows = await query.execute()

      return {
        data: rows,
        count,
      }
    }),

  update: protectedProcedure
    .input(updateCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, parts, ...data } = input
      await ctx.db.transaction().execute(async (trx) => {
        await trx
          .deleteFrom('CurriculumPart')
          .where('curriculumId', '=', id)
          .execute()
        for (const part of parts) {
          await trx
            .insertInto('CurriculumPart')
            .values({ ...part, curriculumId: id })
            .execute()
        }
        await trx
          .updateTable('Curriculum')
          .set(data)
          .where('id', '=', id)
          .execute()
      })
      return true
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })
      await deleteCurricula(input)
      return true
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await deleteCurricula(input)
      return true
    }),
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.role.includes('ADMIN'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'لا تملك الصلاحيات لهذه العملية',
      })
    await deleteCurricula(undefined)
    return true
  }),
})
