import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/curriculum/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

export function applyCurriculaInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Curriculum'>) => {
    return [
      ...(include?.parts
        ? [
            jsonArrayFrom(
              eb
                .selectFrom('CurriculumPart')
                .selectAll('CurriculumPart')
                .whereRef('CurriculumPart.curriculumId', '=', 'Curriculum.id'),
            ).as('parts'),
          ]
        : []),

      ...(include?.track
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Track')
                .selectAll('Track')
                .whereRef('Curriculum.trackId', '=', 'Track.id')
                .select((eb) => [
                  ...(typeof include.track !== 'boolean' &&
                  include.track?.course
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Course')
                            .selectAll('Course')
                            .whereRef('Track.courseId', '=', 'Course.id'),
                        ).as('course'),
                      ]
                    : []),
                ]),
            ).as('track'),
          ]
        : []),
    ]
  }
}

export function applyCurriculaFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Curriculum'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.trackId) where.push(eb('trackId', '=', filters.trackId))
    return eb.and(where)
  }
}

export function deleteCurricula(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Curriculum')
  if (ids !== undefined) query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
