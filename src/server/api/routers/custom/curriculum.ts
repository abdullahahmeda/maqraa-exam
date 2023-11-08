import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

const curriculumFilterSchema = z.object({
  trackId: z.string().optional(),
})

const curriculumIncludeSchema = z.record(
  z.union([z.literal('parts'), z.literal('track')]),
  z.boolean().optional()
)

function applyCurriculumFilters<O>(
  query: SelectQueryBuilder<DB, 'Curriculum', O>,
  filters: z.infer<typeof curriculumFilterSchema>
) {
  return applyFilters(query, filters)
}

export const curriculumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCurriculumSchema)
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
    .input(
      z.object({
        id: z.string(),
        include: curriculumIncludeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db
        .selectFrom('Curriculum')
        .selectAll('Curriculum')
        .where('id', '=', input.id)
        .$if(!!input.include?.parts, (qb) =>
          qb.select((eb) => [
            jsonArrayFrom(
              eb
                .selectFrom('CurriculumPart')
                .selectAll('CurriculumPart')
                .whereRef('CurriculumPart.curriculumId', '=', 'Curriculum.id')
            ).as('parts'),
          ])
        )
        .executeTakeFirst()
    }),

  list: protectedProcedure
    .input(
      z.object({
        filters: curriculumFilterSchema.optional().default({}),
        include: curriculumIncludeSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .selectFrom('Curriculum')
        .selectAll('Curriculum')
        .$if(!!input.include?.track, (qb) =>
          qb
            .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
            .leftJoin('Course', 'Track.courseId', 'Course.id')
            .select(['Course.name as courseName', 'Track.name as trackName'])
        )

      return await applyPagination(
        applyCurriculumFilters(query, input.filters),
        input.pagination
      ).execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: curriculumFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applyCurriculumFilters(
        ctx.db
          .selectFrom('Curriculum')
          .select(({ fn }) => fn.count('id').as('total')),
        input.filters
      )

      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),

  update: protectedProcedure
    .input(editCurriculumSchema)
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
      await ctx.db.deleteFrom('Curriculum').where('id', '=', input).execute()
      return true
    }),
})
