import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/course/common'
import { CreateCourseSchema } from '~/validation/backend/mutations/course/create'
import { UpdateCourseSchema } from '~/validation/backend/mutations/course/update'
import { ListCourseSchema } from '~/validation/backend/queries/course/list'
import { applyPagination } from '~/utils/db'

export function applyCoursesFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Course'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export async function createCourse(data: CreateCourseSchema) {
  return db.insertInto('Course').values(data).execute()
}

export async function getEditCourse(courseId: string) {
  return db
    .selectFrom('Course')
    .selectAll()
    .where('id', '=', courseId)
    .executeTakeFirst()
}

export async function getCoursesTableList(input?: ListCourseSchema) {
  const where = applyCoursesFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Course')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db.selectFrom('Course').selectAll().where(where),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export async function updateCourse(input: UpdateCourseSchema) {
  const { id, ...data } = input
  return db.updateTable('Course').set(data).where('id', '=', id).execute()
}

export function deleteCourses(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Course')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
