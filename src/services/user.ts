import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/user/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

export function applyUsersFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'User'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.email) where.push(eb('email', 'ilike', `%${filters.email}%`))
    if (filters?.role) where.push(eb('role', '=', filters.role))

    if (filters?.userCycle) {
      const { id, cycleId, curriculumId } = filters.userCycle
      if (id !== undefined) {
        where.push(
          eb.exists(
            eb
              .selectFrom('UserCycle')
              .select('UserCycle.id')
              .where('UserCycle.id', '=', id)
              .whereRef('UserCycle.userId', '=', 'User.id'),
          ),
        )
      }
      if (cycleId !== undefined) {
        where.push(
          eb.exists(
            eb
              .selectFrom('UserCycle')
              .select('UserCycle.cycleId')
              .where('UserCycle.cycleId', '=', cycleId)
              .whereRef('UserCycle.userId', '=', 'User.id'),
          ),
        )
      }
      if (curriculumId !== undefined) {
        where.push(
          eb.exists(
            eb
              .selectFrom('UserCycle')
              .select('UserCycle.curriculumId')
              .where('UserCycle.curriculumId', '=', curriculumId)
              .whereRef('UserCycle.userId', '=', 'User.id'),
          ),
        )
      }
    }

    return eb.and(where)
  }
}

export function applyUsersInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'User'>) => {
    return [
      ...(include?.cycles
        ? [
            jsonArrayFrom(
              eb
                .selectFrom('UserCycle')
                .selectAll('UserCycle')
                .whereRef('UserCycle.userId', '=', 'User.id')
                .select((eb) => [
                  ...(typeof include.cycles !== 'boolean' &&
                  !!include.cycles?.curriculum
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Curriculum')
                            .selectAll('Curriculum')
                            .whereRef(
                              'UserCycle.curriculumId',
                              '=',
                              'Curriculum.id',
                            )
                            .select((eb) => [
                              ...(typeof include.cycles !== 'boolean' &&
                              typeof include.cycles?.curriculum !== 'boolean' &&
                              !!include.cycles?.curriculum?.track
                                ? [
                                    jsonObjectFrom(
                                      eb
                                        .selectFrom('Track')
                                        .selectAll('Track')
                                        .whereRef(
                                          'Curriculum.trackId',
                                          '=',
                                          'Track.id',
                                        )
                                        .select((eb) => [
                                          ...(typeof include.cycles !==
                                            'boolean' &&
                                          typeof include.cycles?.curriculum !==
                                            'boolean' &&
                                          typeof include.cycles?.curriculum
                                            ?.track !== 'boolean' &&
                                          !!include.cycles?.curriculum?.track
                                            ?.course
                                            ? [
                                                jsonObjectFrom(
                                                  eb
                                                    .selectFrom('Course')
                                                    .selectAll('Course')
                                                    .whereRef(
                                                      'Track.courseId',
                                                      '=',
                                                      'Course.id',
                                                    ),
                                                ).as('course'),
                                              ]
                                            : []),
                                        ]),
                                    ).as('track'),
                                  ]
                                : []),
                            ]),
                        ).as('curriculum'),
                      ]
                    : []),
                  ...(typeof include.cycles !== 'boolean' &&
                  include.cycles?.cycle
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Cycle')
                            .selectAll('Cycle')
                            .whereRef('UserCycle.cycleId', '=', 'Cycle.id'),
                        ).as('cycle'),
                      ]
                    : []),
                ]),
            ).as('cycles'),
          ]
        : []),
    ]
  }
}

export function deleteUsers(ids: string | string[] | undefined) {
  let query = db.deleteFrom('User')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}
