import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/question-style/common'

export function applyQuestionStylesFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'QuestionStyle'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    if (filters?.type) where.push(eb('type', '=', filters.type))
    return eb.and(where)
  }
}

export function deleteQuestionStyles(ids: string | string[] | undefined) {
  let query = db.deleteFrom('QuestionStyle')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
