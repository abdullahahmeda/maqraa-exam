import { Kysely, SelectQueryBuilder } from 'kysely'
import { TableReference } from 'kysely/dist/cjs/parser/table-parser'
import { OrderBy, Query } from '~/types'

function notImplemented(method: string) {
  throw new Error(`\`${method}\` is not implemented.`)
}

export abstract class Service<DB, TB extends keyof DB> {
  protected db: Kysely<DB>
  protected baseSelectQuery: SelectQueryBuilder<DB, TB, {}>

  constructor(db: Kysely<DB>) {
    this.db = db
  }

  protected getBaseSelectQuery<TInclude extends {}>({
    include,
  }: {
    include?: TInclude | undefined
  }) {
    const query = this.baseSelectQuery.selectAll()
    return query
  }

  public async getListQuery<TFilters extends {}, TOrderBy, TInclude extends {}>(
    params: Query<TFilters, TOrderBy, TInclude>
  ) {
    let query = this.getBaseSelectQuery({ include: params?.include })
    Object.defineProperty(query, 'then', { value: undefined })
    if (params?.filters) query = await this.applyFilters(query, params.filters)
    if (params?.cursor) query = await this.applyCursor(query, params.cursor)
    if (params?.orderBy)
      query = await this.applyOrderBy(query, params.orderBy as any)
    if (params?.limit) query = await this.applyLimit(query, params.limit)
    return query
  }

  public async getCount<TFilters extends {}>(filters?: TFilters | undefined) {
    const table = this.getTableName()
    const primaryKeyColumn = this.getPrimaryKeyColumn() as any
    let query = this.db
      .selectFrom(table)
      .select(({ fn }) => fn.count<number>(primaryKeyColumn).as('count'))

    Object.defineProperty(query, 'then', { value: undefined })

    if (filters) query = await this.applyFilters(query, filters)
    const result = await query.executeTakeFirstOrThrow()
    return Number(result.count)
  }

  public async getList<O, TFilters extends {}, TInclude extends {}>(
    params: Query<TFilters, OrderBy<DB, TB, O>, TInclude>
  ) {
    const query = await this.getListQuery(params)
    const results = await query.execute()
    return results
  }

  public async create(params: any): Promise<any> {
    notImplemented('create')
  }

  public async delete<T>(ids: T | T[] | undefined) {
    const table = this.getTableName()
    const primaryKey = this.getPrimaryKeyColumn() as any
    let query = this.db.deleteFrom(table)
    if (ids !== undefined) {
      if (typeof ids === 'string') {
        query = query.where(primaryKey, '=', ids)
      } else {
        query = query.where(primaryKey, 'in', ids)
      }
    }
    return await query.execute()
  }

  public async applyFilters<TFilters extends {}>(
    query: SelectQueryBuilder<any, any, any>,
    filters: TFilters
  ): Promise<any> {
    notImplemented('applyFilters')
  }

  public async applyCursor<TOrderBy extends {}>(
    query: SelectQueryBuilder<any, any, any>,
    cursor: TOrderBy
  ): Promise<SelectQueryBuilder<any, any, any>> {
    const column = this.getCursorColumn()
    query = query.where(column, '>=', cursor)
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }

  public async applyOrderBy(
    query: SelectQueryBuilder<any, any, any>,
    orderBy: OrderBy<any, any, any> | OrderBy<any, any, any>[]
  ): Promise<SelectQueryBuilder<any, any, any>> {
    if (Array.isArray(orderBy)) {
      for (const { expression, direction } of orderBy) {
        query = query.orderBy(expression, direction)
      }
    } else {
      const { expression, direction } = orderBy
      query = query.orderBy(expression, direction)
    }
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }

  public async applyLimit(
    query: SelectQueryBuilder<any, any, any>,
    limit: number
  ): Promise<SelectQueryBuilder<any, any, any>> {
    query = query.limit(limit)
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }

  public getTableName(): TableReference<DB> {
    return this.constructor.name.replace('Service', '') as TableReference<DB>
  }

  public getCursorColumn() {
    return this.getPrimaryKeyColumn()
  }

  public getPrimaryKeyColumn() {
    return 'id'
  }
}
