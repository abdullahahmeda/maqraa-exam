import { ColumnFiltersState } from '@tanstack/react-table'
import { ParsedUrlQuery } from 'querystring'
import { z } from 'zod'

export function getColumnFilters(
  query: ParsedUrlQuery,
  validators: Record<string, z.ZodType>
) {
  const columnFilters: ColumnFiltersState = []
  Object.entries(validators).forEach(([id, validator]) => {
    const result = validator.safeParse(query[id])
    if (result.success) columnFilters.push({ id, value: result.data })
  })
  return columnFilters
}
