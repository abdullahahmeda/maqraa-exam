import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/cycle/common'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { ListCycleSchema } from '~/validation/backend/queries/cycle/list'
import { CreateCycleBackendSchema } from '~/validation/backend/mutations/cycle/create'
import { createId } from '@paralleldrive/cuid2'
import { applyPagination } from '~/utils/db'
import { UpdateCycleBackendSchema } from '~/validation/backend/mutations/cycle/update'

export async function createCycle(data: CreateCycleBackendSchema) {
  const { name, curricula } = data
  const id = createId()
  return db.transaction().execute(async (trx) => {
    await trx.insertInto('Cycle').values({ id, name }).execute()
    await trx
      .insertInto('CycleCurriculum')
      .values(curricula.map((curriculumId) => ({ curriculumId, cycleId: id })))
      .execute()
  })
}

export function getCycle(id: string) {
  return db
    .selectFrom('Cycle')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export function getCycleForEdit(id: string) {
  return db
    .selectFrom('Cycle')
    .selectAll()
    .where('id', '=', id)
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom('CycleCurriculum')
          .innerJoin(
            'Curriculum',
            'CycleCurriculum.curriculumId',
            'Curriculum.id',
          )
          .select([
            'Curriculum.name as curriculumName',
            'Curriculum.id as curriculumId',
          ])
          .whereRef('Cycle.id', '=', 'CycleCurriculum.cycleId'),
      ).as('cycleCurricula'),
    )
    .executeTakeFirst()
}

export function getCycles(input?: { filters?: FiltersSchema }) {
  return db
    .selectFrom('Cycle')
    .selectAll()
    .where(applyCyclesFilters(input?.filters))
    .execute()
}

export async function getCyclesForTable(input?: ListCycleSchema) {
  const where = applyCyclesFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Cycle')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const rows = await applyPagination(
    db.selectFrom('Cycle').selectAll('Cycle')
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom('CycleCurriculum')
          .innerJoin(
            'Curriculum',
            'CycleCurriculum.curriculumId',
            'Curriculum.id',
          )
          .select([
            'Curriculum.name as curriculumName',
            'Curriculum.id as curriculumId',
          ])
          .whereRef('Cycle.id', '=', 'CycleCurriculum.cycleId'),
      ).as('cycleCurricula'),
    )
    .where(where),
    input?.pagination,
  ).execute()

  return {
    data: rows,
    count,
  }
}

export async function updateCycle(data: UpdateCycleBackendSchema) {
  const { id, name, curricula } = data
  return db.transaction().execute(async (trx) => {
    await trx.updateTable('Cycle').set({ name }).where('id', '=', id).execute()
    await trx.deleteFrom('CycleCurriculum').where('cycleId', '=', id).execute()
    await trx
      .insertInto('CycleCurriculum')
      .values(curricula.map((curriculumId) => ({ curriculumId, cycleId: id })))
      .execute()
  })
}

export function applyCyclesFilters(filters: FiltersSchema | undefined) {
  const where: Expression<SqlBool>[] = []

  return (eb: ExpressionBuilder<DB, 'Cycle'>) => {
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export function deleteCycles(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Cycle')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
