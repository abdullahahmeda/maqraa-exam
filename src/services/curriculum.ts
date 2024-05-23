import { db } from '~/server/db'

export function deleteCurricula(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Curriculum')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
