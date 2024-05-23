import {
  type Selectable,
  sql,
  type ExpressionBuilder,
  type SqlBool,
  type Expression,
} from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import type { CurriculumPart, DB } from '~/kysely/types'
import { db } from '~/server/db'
import {
  type IncludeSchema,
  type FiltersSchema,
} from '~/validation/backend/queries/question/common'
import { type ListRandomQuestionsSchema } from '~/validation/backend/queries/question/list-random'

export async function applyQuestionsFilters(
  filters: FiltersSchema | undefined,
) {
  let curriculumParts: Selectable<CurriculumPart>[] = []
  if (filters?.curriculum !== undefined)
    curriculumParts = await db
      .selectFrom('CurriculumPart')
      .selectAll()
      .where('curriculumId', '=', filters.curriculum.id)
      .execute()
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.id !== undefined) where.push(eb('id', '=', filters.id))
    if (filters?.text !== undefined)
      where.push(eb('text', 'like', '%' + filters.text + '%'))
    if (filters?.isInsideShaded !== undefined)
      where.push(eb('isInsideShaded', '=', filters.isInsideShaded))
    if (filters?.courseId !== undefined)
      where.push(eb('courseId', '=', filters.courseId))
    if (filters?.styleId !== undefined)
      where.push(eb('styleId', '=', filters.styleId))
    if (filters?.type !== undefined) where.push(eb('type', '=', filters.type))
    if (filters?.difficulty !== undefined)
      where.push(eb('difficulty', '=', filters.difficulty))
    if (filters?.number !== undefined)
      where.push(eb('number', '=', filters.number))
    if (filters?.pageNumber !== undefined)
      where.push(eb('pageNumber', '=', filters.pageNumber))
    if (filters?.hadithNumber !== undefined) {
      if (typeof filters.hadithNumber === 'number')
        where.push(eb('hadithNumber', '=', filters.hadithNumber))
      else {
        if (filters.hadithNumber.from)
          where.push(eb('hadithNumber', '<=', filters.hadithNumber.from))
        if (filters.hadithNumber.to)
          where.push(eb('hadithNumber', '>=', filters.hadithNumber.to))
      }
    }

    if (filters?.curriculum !== undefined) {
      if (curriculumParts.length === 0) {
        // empty results
        where.push(sql`1 != 1`)
      } else {
        where.push(
          eb.or(
            curriculumParts.map((part) => {
              let from = part.from
              let to = part.to
              if (filters.curriculum!.type === 'FIRST_MEHWARY') to = part.mid
              else if (filters.curriculum!.type === 'SECOND_MEHWARY')
                from = part.mid
              return eb.and([
                eb('partNumber', '=', part.number),
                eb('hadithNumber', '>=', from),
                eb('hadithNumber', '<=', to),
              ])
            }),
          ),
        )
      }
    }

    if (filters?.partNumber !== undefined)
      where.push(eb('partNumber', '=', filters.partNumber))
    return eb.and(where)
  }
}

export function applyQuestionsInclude<O>(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    return [
      ...(include?.course
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Course')
                .selectAll('Course')
                .whereRef('Question.courseId', '=', 'Course.id'),
            ).as('course'),
          ]
        : []),
      ...(include?.style
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('QuestionStyle')
                .selectAll('QuestionStyle')
                .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
            ).as('style'),
          ]
        : []),
    ]
  }
}

export function deleteQuestions(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Question')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}

export async function listRandomQuestions(input: ListRandomQuestionsSchema) {
  const where = await applyQuestionsFilters(input.filters)
  return db
    .selectFrom('Question')
    .selectAll('Question')
    .select(applyQuestionsInclude(input.include))
    .where(where)
    .orderBy(sql`RANDOM()`)
}
