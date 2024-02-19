import { SelectQueryBuilder, sql } from 'kysely'
import { AllSelection } from 'kysely/dist/cjs/parser/select-parser'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { DB } from '~/kysely/types'
import { db } from '~/server/db'
import { OrderBy, Query } from '~/types'
import { IncludeInput, FiltersInput } from '~/validation/queries/question'
import { Service } from './Service'

export class QuestionService extends Service<DB, 'Question'> {
  protected baseSelectQuery = db.selectFrom('Question')

  protected getBaseSelectQuery({
    include,
  }: {
    include?: IncludeInput | undefined
  }) {
    const query = this.baseSelectQuery
      .selectAll()
      .$if(!!include?.course, (qb) =>
        qb.select(({ selectFrom }) =>
          jsonObjectFrom(
            selectFrom('Course')
              .selectAll('Course')
              .whereRef('Question.courseId', '=', 'Course.id')
          ).as('course')
        )
      )
      .$if(!!include?.style, (qb) =>
        qb.select(({ selectFrom }) =>
          jsonObjectFrom(
            selectFrom('QuestionStyle')
              .selectAll('QuestionStyle')
              .whereRef('Question.styleId', '=', 'QuestionStyle.id')
          ).as('style')
        )
      )

    return query
  }

  public async applyFilters<O>(
    query: SelectQueryBuilder<DB, 'Question', O>,
    filters: FiltersInput | undefined
  ): Promise<SelectQueryBuilder<DB, 'Question', O>> {
    if (filters !== undefined) {
      const {
        id,
        text,
        type,
        number,
        styleId,
        courseId,
        curriculum,
        difficulty,
        pageNumber,
        partNumber,
        hadithNumber,
        isInsideShaded,
      } = filters

      if (id !== undefined) query = query.where('id', '=', id)
      if (text !== undefined)
        query = query.where('text', 'like', '%' + text + '%')
      if (isInsideShaded !== undefined)
        query = query.where('isInsideShaded', '=', isInsideShaded)
      if (courseId !== undefined) query = query.where('courseId', '=', courseId)
      if (styleId !== undefined) query = query.where('styleId', '=', styleId)
      if (type !== undefined) query = query.where('type', '=', type)
      if (difficulty !== undefined)
        query = query.where('difficulty', '=', difficulty)
      if (number !== undefined) query = query.where('number', '=', number)
      if (pageNumber !== undefined)
        query = query.where('pageNumber', '=', pageNumber)
      if (hadithNumber !== undefined) {
        if (typeof hadithNumber === 'number')
          query = query.where('hadithNumber', '=', hadithNumber)
        else {
          if (hadithNumber.from)
            query = query.where('hadithNumber', '<=', hadithNumber.from)
          if (hadithNumber.to)
            query = query.where('hadithNumber', '>=', hadithNumber.to)
        }
      }

      if (curriculum !== undefined) {
        const curriculumParts = await db
          .selectFrom('CurriculumPart')
          .selectAll()
          .where('curriculumId', '=', curriculum.id)
          .execute()
        if (curriculumParts.length === 0) {
          // empty results
          query = query.where(sql`1 != 1`)
        } else {
          query = query.where(({ or, and, eb }) =>
            or(
              curriculumParts.map((part) => {
                let from = part.from
                let to = part.to
                if (curriculum.type === 'FIRST_MEHWARY') to = part.mid
                else if (curriculum.type === 'SECOND_MEHWARY') from = part.mid
                return and([
                  eb('partNumber', '=', part.number),
                  eb('hadithNumber', '>=', from),
                  eb('hadithNumber', '<=', to),
                ])
              })
            )
          )
        }
      }

      if (partNumber !== undefined)
        query = query.where('partNumber', '=', partNumber)
    }
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }

  public async getRandomQuery(params: QuestionsQuery) {
    let orderBy: QuestionsOrderBy[]
    if (params.orderBy === undefined) orderBy = []
    else if (
      typeof params.orderBy === 'object' &&
      !Array.isArray(params.orderBy)
    ) {
      orderBy = [params.orderBy]
    } else {
      orderBy = [...params.orderBy]
    }
    const query = await this.getListQuery({
      ...params,
      orderBy: [{ expression: sql`RANDOM()` }, ...orderBy],
    })
    Object.defineProperty(query, 'then', { value: undefined })
    return query
  }

  public async getRandom(params: QuestionsQuery) {
    const query = await this.getRandomQuery(params)
    const results = await query.execute()
    return results
  }
}

type QuestionsOrderBy = OrderBy<DB, 'Question', AllSelection<DB, 'Question'>>

type QuestionsQuery = Query<FiltersInput, QuestionsOrderBy, IncludeInput>
