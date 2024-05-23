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

// import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
// import { DB } from '~/kysely/types'
// import { db } from '~/server/db'
// import { Query } from '~/types'
// import { Service } from './Service'
// import { SelectQueryBuilder } from 'kysely'
// import { NewUserSchema } from '~/validation/newUserSchema'
// import { hashPassword } from '~/utils/server/password'
// import { FiltersInput, IncludeInput } from '~/validation/backend/queries/user'

// export type UsersQuery = Query<FiltersInput, any, IncludeInput>

// export class UserService extends Service<DB, 'User'> {
//   protected baseSelectQuery = db.selectFrom('User')

//   protected getBaseSelectQuery({
//     include,
//   }: {
//     include?: IncludeInput | undefined
//   }) {
//     const query = this.baseSelectQuery
//       .selectAll()
//       .$if(!!include?.cycles, (qb) =>
//         qb.select(({ selectFrom }) =>
//           jsonArrayFrom(
//             selectFrom('UserCycle')
//               .selectAll('UserCycle')
//               .whereRef('UserCycle.userId', '=', 'User.id')
//               .$if(
//                 typeof include!.cycles !== 'boolean' &&
//                   include!.cycles?.cycle !== undefined,
//                 (qb) =>
//                   qb.select(({ selectFrom }) =>
//                     jsonObjectFrom(
//                       selectFrom('Cycle')
//                         .selectAll('Cycle')
//                         .whereRef('UserCycle.cycleId', '=', 'Cycle.id'),
//                     ).as('cycle'),
//                   ),
//               )
//               .$if(
//                 typeof include!.cycles !== 'boolean' &&
//                   include!.cycles?.curriculum !== undefined,
//                 (qb) =>
//                   qb.select(({ selectFrom }) =>
//                     jsonObjectFrom(
//                       selectFrom('Curriculum')
//                         .selectAll('Curriculum')
//                         .whereRef(
//                           'UserCycle.curriculumId',
//                           '=',
//                           'Curriculum.id',
//                         ),
//                     ).as('curriculum'),
//                   ),
//               ),
//           ).as('cycles'),
//         ),
//       )

//     return query
//   }

//   public async create(params: NewUserSchema) {
//     const { email, password, name, role, phone } = params
//     const hashedPassword = hashPassword(password)
//     const result = await db.transaction().execute(async (trx) => {
//       const user = await trx
//         .insertInto('User')
//         .values({
//           name,
//           email,
//           password: hashedPassword,
//           role,
//           phone,
//         })
//         .returning('id')
//         .executeTakeFirstOrThrow()

//       if (role === 'CORRECTOR') {
//         await trx
//           .insertInto('UserCycle')
//           .values(
//             Object.entries(params.corrector.cycles).flatMap(
//               ([cycleId, { curricula }]) =>
//                 curricula.map((curriculumId) => ({
//                   cycleId,
//                   curriculumId,
//                   userId: user.id,
//                 })),
//             ),
//           )
//           .returning('id')
//           .executeTakeFirstOrThrow()
//       } else if (role === 'STUDENT') {
//         await trx
//           .insertInto('UserCycle')
//           .values(
//             Object.entries(params.student.cycles).map(
//               ([cycleId, { curriculumId }]) => ({
//                 cycleId,
//                 curriculumId,
//                 userId: user.id,
//               }),
//             ),
//           )
//           .execute()
//       }
//       return user
//     })
//     return result
//   }

//   public async applyFilters<O>(
//     query: SelectQueryBuilder<DB, 'User', O>,
//     filters: FiltersInput | undefined,
//   ): Promise<SelectQueryBuilder<DB, 'User', O>> {
//     if (filters !== undefined) {
//       const { email, role, userCycle } = filters

//       if (email !== undefined) {
//         query = query.where('email', 'like', email + '%')
//       }
//       if (role !== undefined) {
//         query = query.where('role', '=', role)
//       }
//       if (userCycle !== undefined) {
//         const { id, cycleId, curriculumId } = userCycle
//         if (id !== undefined) {
//           query = query.where(({ exists, selectFrom }) =>
//             exists(
//               selectFrom('UserCycle')
//                 .select('UserCycle.id')
//                 .where('UserCycle.id', '=', id)
//                 .whereRef('UserCycle.userId', '=', 'User.id'),
//             ),
//           )
//         }
//         if (cycleId !== undefined) {
//           query = query.where(({ exists, selectFrom }) =>
//             exists(
//               selectFrom('UserCycle')
//                 .select('UserCycle.cycleId')
//                 .where('UserCycle.cycleId', '=', cycleId)
//                 .whereRef('UserCycle.userId', '=', 'User.id'),
//             ),
//           )
//         }
//         if (curriculumId !== undefined) {
//           query = query.where(({ exists, selectFrom }) =>
//             exists(
//               selectFrom('UserCycle')
//                 .select('UserCycle.curriculumId')
//                 .where('UserCycle.curriculumId', '=', curriculumId)
//                 .whereRef('UserCycle.userId', '=', 'User.id'),
//             ),
//           )
//         }
//       }
//     }
//     Object.defineProperty(query, 'then', { value: undefined })
//     return query
//   }
// }
