import { SelectQueryBuilder } from 'kysely'
import { OrderBy } from '~/types'

export function applyOrderBy<DB, TB extends keyof DB, QO>(
  query: SelectQueryBuilder<DB, TB, QO>,
  orderBy: OrderBy<DB, TB, QO> | OrderBy<DB, TB, QO>[]
) {
  if (Array.isArray(orderBy)) {
    for (const { expression, direction } of orderBy) {
      query = query.orderBy(expression, direction)
    }
  } else {
    const { expression, direction } = orderBy
    query = query.orderBy(expression, direction)
  }
  return query
}
