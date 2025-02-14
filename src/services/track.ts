import type { Expression, ExpressionBuilder, SqlBool } from 'kysely'
import { applyPagination } from '~/utils/db'
import { type DB } from '~/kysely/types'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/track/common'
import { db } from '~/server/db'
import { type CreateTrackSchema } from '~/validation/backend/mutations/track/create'
import { type ListTrackSchema } from '~/validation/backend/queries/track/list'
import { type UpdateTrackSchema } from '~/validation/backend/mutations/track/update'

function applyInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Track'>) => {
    return [
      ...(include?.course
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Course')
                .selectAll('Course')
                .whereRef('Track.courseId', '=', 'Course.id'),
            ).as('course'),
          ]
        : []),
    ]
  }
}

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Track'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.courseId) where.push(eb('courseId', '=', filters.courseId))
    return eb.and(where)
  }
}

export async function createTrack(data: CreateTrackSchema) {
  await db.insertInto('Track').values(data).execute()
}

export async function getTracksTableList(input?: ListTrackSchema) {
  const where = applyFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Track')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('Track')
      .selectAll()
      .select(applyInclude(input?.include))
      .where(where),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export async function getEditTrack(id: string) {
  const data = await db
    .selectFrom('Track')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
  return data
}

export function deleteTracks(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Track')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}

export async function updateTrack(input: UpdateTrackSchema) {
  const { id, ...data } = input
  await db.updateTable('Track').set(data).where('id', '=', id).execute()
}
