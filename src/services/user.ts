import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/user/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { ListUserSchema } from '~/validation/backend/queries/user/list'
import { applyPagination } from '~/utils/db'

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
export async function getUserList(
  input: ListUserSchema | undefined,
  context: 'table',
): ReturnType<typeof _getUserTableList>
export async function getUserList(
  input: ListUserSchema | undefined,
  context?: 'base',
): ReturnType<typeof _getUserList>
export async function getUserList(
  input: ListUserSchema | undefined,
  context: 'table' | 'base' = 'base',
) {
  switch (context) {
    case 'table':
      return _getUserTableList(input)
    case 'base':
    default:
      return _getUserList(input)
  }
}

async function _getUserList(input: ListUserSchema | undefined) {
  const where = applyUsersFilters(input?.filters)
  return db.selectFrom('User').selectAll().where(where).execute()
}

async function _getUserTableList(input: ListUserSchema | undefined) {
  const where = applyUsersFilters(input?.filters)
  const count = Number(
    (
      await db
        .selectFrom('User')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('User')
      .selectAll('User')
      .where(where)
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('UserCycle')
            .selectAll('UserCycle')
            .whereRef('UserCycle.userId', '=', 'User.id')
            .select((eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom('Cycle')
                  .selectAll('Cycle')
                  .whereRef('UserCycle.cycleId', '=', 'Cycle.id'),
              ).as('cycle'),
            ),
        ).as('cycles'),
      ),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export function deleteUsers(ids: string | string[] | undefined) {
  let query = db.deleteFrom('User').where('role', '!=', 'SUPER_ADMIN')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
