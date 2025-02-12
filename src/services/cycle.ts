import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/cycle/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

export function applyCyclesFilters(filters: FiltersSchema | undefined) {
  const where: Expression<SqlBool>[] = []

  return (eb: ExpressionBuilder<DB, 'Cycle'>) => {
    if (filters?.name) where.push(eb('name', 'like', `%${filters.name}%`))
    return eb.and(where)
  }
}

export function applyCyclesInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Cycle'>) => {
    return [
      ...(include?.cycleCurricula
        ? [
            jsonArrayFrom(
              eb
                .selectFrom('CycleCurriculum')
                .selectAll('CycleCurriculum')
                .select((eb) => [
                  ...(typeof include.cycleCurricula !== 'boolean' &&
                  include.cycleCurricula?.curriculum
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Curriculum')
                            .selectAll('Curriculum')
                            .whereRef(
                              'Curriculum.id',
                              '=',
                              'CycleCurriculum.curriculumId',
                            ),
                        ).as('curriculum'),
                      ]
                    : []),
                ])
                .whereRef('CycleCurriculum.cycleId', '=', 'Cycle.id'),
            ).as('cycleCurricula'),
          ]
        : []),
    ]
  }
}

export function deleteCycles(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Cycle')
  if (ids !== undefined) query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
