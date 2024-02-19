import { OrderByDirectionExpression, OrderByExpression } from 'kysely'
import { FieldPath, FieldValues } from 'react-hook-form'

export type PageOptions = {
  page: number
  pageSize: number
}

export type ListResponse = {
  data: []
  count: number
}

export type Fields<
  TFieldKeys extends number | string,
  TFieldValues extends FieldValues
> = Record<TFieldKeys, FieldPath<TFieldValues>>

export type OrderBy<DB, TB extends keyof DB, O> = {
  expression: OrderByExpression<DB, TB, O>
  direction?: OrderByDirectionExpression | undefined
}

export type Query<TFilters, TOrderBy, TInclude> = {
  limit?: number | undefined
  filters?: TFilters | undefined
  orderBy?: TOrderBy[] | TOrderBy | undefined
  cursor?: string | undefined
  include?: TInclude | undefined
}
