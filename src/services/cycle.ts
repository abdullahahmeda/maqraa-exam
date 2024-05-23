import { db } from '~/server/db'

export function deleteCycles(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Cycle')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
