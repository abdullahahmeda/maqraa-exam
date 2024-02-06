import {
  AliasedAggregateFunctionBuilder,
  Selection,
  SelectQueryBuilder,
} from 'kysely'

type Callable<DB, TB extends keyof DB, O> = (
  ...args: any
) => SelectQueryBuilder<DB, TB, O>

type Modifier<DB, TB extends keyof DB, O, F extends Callable<DB, TB, O>> = {
  modifier: F
  params?: Parameters<F>
}

type E<DB, TB extends keyof DB, O> = {
  query: SelectQueryBuilder<DB, TB, O>
  modifiers?: Modifier<DB, TB, O, any>[]
}

function applyModifiers<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  modifiers: Modifier<DB, TB, O, any>[] | undefined
) {
  if (!modifiers) return query
  for (const { modifier, params } of modifiers) {
    query = modifier(query, ...(params ?? []))
  }
  return query
}

export async function getListResponse<
  // "rows" generics
  RDB,
  RTB extends keyof RDB,
  RO,
  // "count" generics
  CDB,
  CTB extends keyof CDB,
  // current db driver returns it as string
  CO extends Selection<
    CDB,
    CTB,
    (...args: any) => AliasedAggregateFunctionBuilder<CDB, CTB, string, 'count'>
  >
>({
  rows: rowsPayload,
  count: countPayload,
}: {
  rows: E<RDB, RTB, RO>
  count: E<CDB, CTB, CO>
}) {
  let countQuery = applyModifiers(countPayload.query, countPayload.modifiers)
  let rowsQuery = applyModifiers(rowsPayload.query, rowsPayload.modifiers)

  const count = Number((await countQuery.executeTakeFirstOrThrow()).count)
  const rows = await rowsQuery.execute()

  return {
    count,
    data: rows,
  }
}
