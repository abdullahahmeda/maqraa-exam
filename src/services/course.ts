import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { db } from '~/server/db'
import { type FiltersSchema } from '~/validation/backend/queries/course/common'

export function applyCoursesFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Course'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export function deleteCourses(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Course')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
