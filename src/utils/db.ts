import type { ReferenceExpression, SelectQueryBuilder } from 'kysely'
import type { PaginationSchema } from '~/validation/pagination'

function defaultFilterHandler<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  col: ReferenceExpression<DB, TB>,
  value: unknown,
) {
  if ((typeof value === 'string' && !value) || typeof value === 'undefined')
    return query
  if (value === 'not_null') return query.where(col, 'is not', null)
  return query.where(col, '=', value)
}

export function applyFilters<
  DB,
  TB extends keyof DB,
  O,
  F extends Record<string, unknown>,
  K extends keyof F,
>(
  query: SelectQueryBuilder<DB, TB, O>,
  filters: F,
  handlers?: Partial<
    Record<
      K,
      (
        query: SelectQueryBuilder<DB, TB, O>,
        value: F[K],
      ) => SelectQueryBuilder<DB, TB, O>
    >
  >,
) {
  if (filters === undefined) return query

  for (const [col, value] of Object.entries(filters)) {
    if (handlers && handlers[col as K])
      query = handlers[col as K]!(query, value as F[K])
    else
      query = defaultFilterHandler(
        query,
        col as ReferenceExpression<DB, TB>,
        value as F[K],
      )
  }

  return query
}

export function applyPagination<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  pagination: PaginationSchema | undefined,
) {
  if (pagination === undefined) return query

  return query
    .offset(pagination.pageIndex * pagination.pageSize)
    .limit(pagination.pageSize)
}
