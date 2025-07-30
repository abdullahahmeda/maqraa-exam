import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/course/common'
import { CreateCourseSchema } from '~/validation/backend/mutations/course/create'
import { UpdateCourseSchema } from '~/validation/backend/mutations/course/update'
import { ListCourseSchema } from '~/validation/backend/queries/course/list'
import { applyPagination } from '~/utils/db'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

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

export async function getCourseData(
  courseId: string,
  context: 'show',
): ReturnType<typeof getCourseDataForShow>
export async function getCourseData(
  courseId: string,
  context: 'edit',
): ReturnType<typeof getEditCourse>
export async function getCourseData(
  courseId: string,
  context: 'show' | 'edit',
) {
  if (context === 'show') {
    return getCourseDataForShow(courseId)
  } else if (context === 'edit') {
    return getEditCourse(courseId)
  }
}

export async function getCourseDataForShow(courseId: string) {
  return db
    .selectFrom('Course')
    .selectAll('Course')
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom('Track')
          .selectAll('Track')
          .select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom('Curriculum')
                .selectAll('Curriculum')
                .whereRef('Track.id', '=', 'Curriculum.trackId'),
            ).as('curricula'),
          )
          .whereRef('Track.courseId', '=', 'Course.id'),
      ).as('tracks'),
    )
    .where('Course.id', '=', courseId)
    .executeTakeFirst()
}

export async function getCourseList(input: undefined, context: 'grid') : ReturnType<typeof _getCourseGridList>
export async function getCourseList(input: undefined, context?: 'base') : ReturnType<typeof _getCourseList>
export async function getCourseList(
  input: undefined,
  context: 'grid' | 'base' = 'base',
) {
  switch (context) {
    case 'grid':
      return _getCourseGridList(input)
    case 'base':
    default:
      return _getCourseList(input)
  }
}

async function _getCourseList(input: undefined) {
  return db.selectFrom('Course').selectAll().execute()
}

async function _getCourseGridList(input: undefined) {
  return db.selectFrom('Course').selectAll().execute()
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
