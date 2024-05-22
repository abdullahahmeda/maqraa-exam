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
import { ListRandomQuestionsSchema } from '~/validation/backend/queries/question/list-random'

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

// import { SelectQueryBuilder, sql } from 'kysely'
// import { AllSelection } from 'kysely/dist/cjs/parser/select-parser'
// import { jsonObjectFrom } from 'kysely/helpers/postgres'
// import { DB } from '~/kysely/types'
// import { db } from '~/server/db'
// import { OrderBy, Query } from '~/types'
// import {
//   IncludeInput,
//   FiltersInput,
// } from '~/validation/backend/queries/question'
// import { Service } from './Service'

// export class QuestionService extends Service<DB, 'Question'> {
//   protected baseSelectQuery = db.selectFrom('Question')

//   protected getBaseSelectQuery({
//     include,
//   }: {
//     include?: IncludeInput | undefined
//   }) {
//     const query = this.baseSelectQuery
//       .selectAll()
//       .$if(!!include?.course, (qb) =>
//         qb.select(({ selectFrom }) =>
//           jsonObjectFrom(
//             selectFrom('Course')
//               .selectAll('Course')
//               .whereRef('Question.courseId', '=', 'Course.id'),
//           ).as('course'),
//         ),
//       )
//       .$if(!!include?.style, (qb) =>
//         qb.select(({ selectFrom }) =>
//           jsonObjectFrom(
//             selectFrom('QuestionStyle')
//               .selectAll('QuestionStyle')
//               .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
//           ).as('style'),
//         ),
//       )

//     return query
//   }

//   public async applyFilters<O>(
//     query: SelectQueryBuilder<DB, 'Question', O>,
//     filters: FiltersInput | undefined,
//   ): Promise<SelectQueryBuilder<DB, 'Question', O>> {
//     if (filters !== undefined) {
//       const {
//         id,
//         text,
//         type,
//         number,
//         styleId,
//         courseId,
//         curriculum,
//         difficulty,
//         pageNumber,
//         partNumber,
//         hadithNumber,
//         isInsideShaded,
//       } = filters

//       if (id !== undefined) query = query.where('id', '=', id)
//       if (text !== undefined)
//         query = query.where('text', 'like', '%' + text + '%')
//       if (isInsideShaded !== undefined)
//         query = query.where('isInsideShaded', '=', isInsideShaded)
//       if (courseId !== undefined) query = query.where('courseId', '=', courseId)
//       if (styleId !== undefined) query = query.where('styleId', '=', styleId)
//       if (type !== undefined) query = query.where('type', '=', type)
//       if (difficulty !== undefined)
//         query = query.where('difficulty', '=', difficulty)
//       if (number !== undefined) query = query.where('number', '=', number)
//       if (pageNumber !== undefined)
//         query = query.where('pageNumber', '=', pageNumber)
//       if (hadithNumber !== undefined) {
//         if (typeof hadithNumber === 'number')
//           query = query.where('hadithNumber', '=', hadithNumber)
//         else {
//           if (hadithNumber.from)
//             query = query.where('hadithNumber', '<=', hadithNumber.from)
//           if (hadithNumber.to)
//             query = query.where('hadithNumber', '>=', hadithNumber.to)
//         }
//       }

//       if (curriculum !== undefined) {
//         const curriculumParts = await db
//           .selectFrom('CurriculumPart')
//           .selectAll()
//           .where('curriculumId', '=', curriculum.id)
//           .execute()
//         if (curriculumParts.length === 0) {
//           // empty results
//           query = query.where(sql`1 != 1`)
//         } else {
//           query = query.where(({ or, and, eb }) =>
//             or(
//               curriculumParts.map((part) => {
//                 let from = part.from
//                 let to = part.to
//                 if (curriculum.type === 'FIRST_MEHWARY') to = part.mid
//                 else if (curriculum.type === 'SECOND_MEHWARY') from = part.mid
//                 return and([
//                   eb('partNumber', '=', part.number),
//                   eb('hadithNumber', '>=', from),
//                   eb('hadithNumber', '<=', to),
//                 ])
//               }),
//             ),
//           )
//         }
//       }

//       if (partNumber !== undefined)
//         query = query.where('partNumber', '=', partNumber)
//     }
//     Object.defineProperty(query, 'then', { value: undefined })
//     return query
//   }

//   public async getRandomQuery(params: QuestionsQuery) {
//     let orderBy: QuestionsOrderBy[]
//     if (params.orderBy === undefined) orderBy = []
//     else if (
//       typeof params.orderBy === 'object' &&
//       !Array.isArray(params.orderBy)
//     ) {
//       orderBy = [params.orderBy]
//     } else {
//       orderBy = [...params.orderBy]
//     }
//     const query = await this.getListQuery({
//       ...params,
//       orderBy: [{ expression: sql`RANDOM()` }, ...orderBy],
//     })
//     Object.defineProperty(query, 'then', { value: undefined })
//     return query
//   }

//   public async getRandom(params: QuestionsQuery) {
//     const query = await this.getRandomQuery(params)
//     const results = await query.execute()
//     return results
//   }
// }

// type QuestionsOrderBy = OrderBy<DB, 'Question', AllSelection<DB, 'Question'>>

// type QuestionsQuery = Query<FiltersInput, QuestionsOrderBy, IncludeInput>
