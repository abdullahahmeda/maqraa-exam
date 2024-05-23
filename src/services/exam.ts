import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/exam/common'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

export function applyExamsInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    return [
      ...(include?.cycle
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Cycle')
                .selectAll('Cycle')
                .whereRef('SystemExam.cycleId', '=', 'Cycle.id'),
            ).as('cycle'),
          ]
        : []),
      ...(include?.curriculum
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Curriculum')
                .selectAll('Curriculum')
                .whereRef('Curriculum.id', '=', 'SystemExam.curriculumId')
                .select((eb) => [
                  ...(typeof include.curriculum !== 'boolean' &&
                  include.curriculum?.track
                    ? [
                        jsonObjectFrom(
                          eb
                            .selectFrom('Track')
                            .selectAll('Track')
                            .whereRef('Curriculum.trackId', '=', 'Track.id')
                            .select((eb) => [
                              ...(typeof include.curriculum !== 'boolean' &&
                              typeof include.curriculum?.track !== 'boolean' &&
                              include.curriculum?.track?.course
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
    ]
  }
}

export function applyExamsFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.curriculumId)
      where.push(eb('SystemExam.curriculumId', '=', filters.curriculumId))
    if (filters?.cycleId)
      where.push(eb('SystemExam.cycleId', '=', filters.cycleId))
    if (filters?.type) where.push(eb('SystemExam.type', '=', filters.type))
    return eb.and(where)
  }
}

export function deleteExams(ids: string | string[] | undefined) {
  let query = db.deleteFrom('SystemExam')
  if (ids !== undefined) query = query.where('id', 'in', [...ids])
  return query.execute()
}

// import { db } from '~/server/db'
// import { Service } from './Service'
// import { DB } from '~/kysely/types'
// import {
//   FiltersInput,
//   IncludeInput,
// } from '~/validation/backend/queries/system-exam'
// import { SelectQueryBuilder } from 'kysely'
// import { jsonObjectFrom } from 'kysely/helpers/postgres'

// export class SystemExamService extends Service<DB, 'SystemExam'> {
//   protected baseSelectQuery = db.selectFrom('SystemExam')

//   protected getBaseSelectQuery({ include }: { include?: IncludeInput }) {
//     const query = db
//       .selectFrom('SystemExam')
//       .selectAll('SystemExam')
//       .$if(!!include?.curriculum, (qb) =>
//         qb.select(({ selectFrom }) =>
//           jsonObjectFrom(
//             selectFrom('Curriculum')
//               .selectAll('Curriculum')
//               .whereRef('SystemExam.curriculumId', '=', 'Curriculum.id')
//               .$if(
//                 typeof include?.curriculum == 'object' &&
//                   !!include?.curriculum?.track,
//                 (qb) =>
//                   qb.select(({ selectFrom }) =>
//                     jsonObjectFrom(
//                       selectFrom('Track')
//                         .selectAll('Track')
//                         .whereRef('Curriculum.trackId', '=', 'Track.id')
//                         .$if(
//                           typeof include?.curriculum !== 'boolean' &&
//                             typeof include?.curriculum?.track !== 'boolean' &&
//                             !!include?.curriculum?.track?.course,
//                           (qb) =>
//                             qb.select(({ selectFrom }) =>
//                               jsonObjectFrom(
//                                 selectFrom('Course')
//                                   .selectAll('Course')
//                                   .whereRef('Track.courseId', '=', 'Course.id'),
//                               ).as('course'),
//                             ),
//                         ),
//                     ).as('track'),
//                   ),
//               ),
//           ).as('curriculum'),
//         ),
//       )
//       .$if(!!include?.cycle, (qb) =>
//         qb.select(({ selectFrom }) =>
//           jsonObjectFrom(
//             selectFrom('Cycle')
//               .selectAll('Cycle')
//               .whereRef('SystemExam.cycleId', '=', 'Cycle.id'),
//           ).as('cycle'),
//         ),
//       )
//     return query
//   }

//   public async applyFilters<O>(
//     query: SelectQueryBuilder<DB, 'SystemExam', O>,
//     filters: FiltersInput | undefined,
//   ): Promise<SelectQueryBuilder<DB, 'SystemExam', O>> {
//     if (filters !== undefined) {
//       const { curriculumId, cycleId, type } = filters
//       if (curriculumId !== undefined)
//         query = query.where('curriculumId', '=', curriculumId)
//       if (cycleId !== undefined) query = query.where('cycleId', '=', cycleId)
//       if (type !== undefined) query = query.where('type', '=', type)
//     }
//     return query
//   }
// }
