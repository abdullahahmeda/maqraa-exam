import { db } from '~/server/db'

export function deleteCourses(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Course')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
