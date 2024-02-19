import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { DB } from '~/kysely/types'
import { db } from '~/server/db'
import { Query } from '~/types'
import { Service } from './Service'
import { SelectQueryBuilder } from 'kysely'
import { NewUserSchema } from '~/validation/newUserSchema'
import { hashPassword } from '~/utils/server/password'
import { FiltersInput, IncludeInput } from '~/validation/queries/user'

export type UsersQuery = Query<FiltersInput, any, IncludeInput>

export class UserService extends Service<DB, 'User'> {
  protected baseSelectQuery = db.selectFrom('User')

  protected getBaseSelectQuery({
    include,
  }: {
    include?: IncludeInput | undefined
  }) {
    const query = this.baseSelectQuery
      .selectAll()
      .$if(!!include?.cycles, (qb) =>
        qb.select(({ selectFrom }) =>
          jsonArrayFrom(
            selectFrom('UserCycle')
              .selectAll('UserCycle')
              .whereRef('UserCycle.userId', '=', 'User.id')
              .$if(
                typeof include!.cycles !== 'boolean' &&
                  include!.cycles?.cycle !== undefined,
                (qb) =>
                  qb.select(({ selectFrom }) =>
                    jsonObjectFrom(
                      selectFrom('Cycle')
                        .selectAll('Cycle')
                        .whereRef('UserCycle.cycleId', '=', 'Cycle.id')
                    ).as('cycle')
                  )
              )
              .$if(
                typeof include!.cycles !== 'boolean' &&
                  include!.cycles?.curriculum !== undefined,
                (qb) =>
                  qb.select(({ selectFrom }) =>
                    jsonObjectFrom(
                      selectFrom('Curriculum')
                        .selectAll('Curriculum')
                        .whereRef(
                          'UserCycle.curriculumId',
                          '=',
                          'Curriculum.id'
                        )
                    ).as('curriculum')
                  )
              )
          ).as('cycles')
        )
      )

    return query
  }

  public async create(params: NewUserSchema) {
    const { email, password, name, role, phone } = params
    const hashedPassword = hashPassword(password)
    const result = await db.transaction().execute(async (trx) => {
      const user = await trx
        .insertInto('User')
        .values({
          name,
          email,
          password: hashedPassword,
          role,
          phone,
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      if (role === 'CORRECTOR') {
        await trx
          .insertInto('UserCycle')
          .values(
            Object.entries(params.corrector.cycles).flatMap(
              ([cycleId, { curricula }]) =>
                curricula.map((curriculumId) => ({
                  cycleId,
                  curriculumId,
                  userId: user.id,
                }))
            )
          )
          .returning('id')
          .executeTakeFirstOrThrow()
      } else if (role === 'STUDENT') {
        await trx
          .insertInto('UserCycle')
          .values(
            Object.entries(params.student.cycles).map(
              ([cycleId, { curriculumId }]) => ({
                cycleId,
                curriculumId,
                userId: user.id,
              })
            )
          )
          .execute()
      }
      return user
    })
    return result
  }

  public async applyFilters<O>(
    query: SelectQueryBuilder<DB, 'User', O>,
    filters: FiltersInput | undefined
  ): Promise<SelectQueryBuilder<DB, 'User', O>> {
    if (filters !== undefined) {
      const { email, role, userCycle } = filters

      if (email !== undefined) {
        query = query.where('email', 'like', email + '%')
      }
      if (role !== undefined) {
        query = query.where('role', '=', role)
      }
      if (userCycle !== undefined) {
        const { id, cycleId, curriculumId } = userCycle
        if (id !== undefined) {
          query = query.where(({ exists, selectFrom }) =>
            exists(
              selectFrom('UserCycle')
                .select('UserCycle.id')
                .where('UserCycle.id', '=', id)
                .whereRef('UserCycle.userId', '=', 'User.id')
            )
          )
        }
        if (cycleId !== undefined) {
          query = query.where(({ exists, selectFrom }) =>
            exists(
              selectFrom('UserCycle')
                .select('UserCycle.cycleId')
                .where('UserCycle.cycleId', '=', cycleId)
                .whereRef('UserCycle.userId', '=', 'User.id')
            )
          )
        }
        if (curriculumId !== undefined) {
          query = query.where(({ exists, selectFrom }) =>
            exists(
              selectFrom('UserCycle')
                .select('UserCycle.curriculumId')
                .where('UserCycle.curriculumId', '=', curriculumId)
                .whereRef('UserCycle.userId', '=', 'User.id')
            )
          )
        }
      }
    }
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }
}
