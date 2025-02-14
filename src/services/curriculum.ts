import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import { applyPagination } from '~/utils/db'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/curriculum/common'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { type CreateCurriculumSchema } from '~/validation/backend/mutations/curriculum/create'
import { type ListCurriculumSchema } from '~/validation/backend/queries/curriculum/list'
import { type UpdateCurriculumSchema } from '~/validation/backend/mutations/curriculum/update'

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

export async function createCurriculum(input: CreateCurriculumSchema) {
  const { parts, ...data } = input
  await db.transaction().execute(async (trx) => {
    const curriculum = await trx
      .insertInto('Curriculum')
      .values(data)
      .returning('id')
      .executeTakeFirst()

    for (const part of parts) {
      await trx
        .insertInto('CurriculumPart')
        .values({ ...part, curriculumId: curriculum!.id })
        .execute()
    }
  })
}

export async function updateCurriculum(input: UpdateCurriculumSchema) {
  const { id, parts, ...data } = input
  await db.transaction().execute(async (trx) => {
    await trx
      .deleteFrom('CurriculumPart')
      .where('curriculumId', '=', id)
      .execute()
    for (const part of parts) {
      await trx
        .insertInto('CurriculumPart')
        .values({ ...part, curriculumId: id })
        .execute()
    }
    await trx.updateTable('Curriculum').set(data).where('id', '=', id).execute()
  })
}

export async function getEditCurriculum(id: string) {
  const data = await db
    .selectFrom('Curriculum')
    .selectAll('Curriculum')
    .where('id', '=', id)
    .select(applyCurriculaInclude({ parts: true }))
    .executeTakeFirst()
  return data
}

export async function getCurriculaTableList(input?: ListCurriculumSchema) {
  const where = applyCurriculaFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Curriculum')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('Curriculum')
      .selectAll()
      .where(where)
      .select(applyCurriculaInclude(input?.include)),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export function deleteCurricula(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Curriculum')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}
