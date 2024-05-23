import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/cycle/common'

export function applyCyclesFilters(filters: FiltersSchema | undefined) {
  const where: Expression<SqlBool>[] = []

  return (eb: ExpressionBuilder<DB, 'Cycle'>) => {
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export function deleteCycles(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Cycle')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
