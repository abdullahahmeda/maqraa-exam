import { db } from '~/server/db'
import { Service } from './Service'
import { DB } from '~/kysely/types'
import {
  FiltersInput,
  IncludeInput,
} from '~/validation/backend/queries/system-exam'
import { SelectQueryBuilder } from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

export class SystemExamService extends Service<DB, 'SystemExam'> {
  protected baseSelectQuery = db.selectFrom('SystemExam')

  protected getBaseSelectQuery({ include }: { include?: IncludeInput }) {
    const query = db
      .selectFrom('SystemExam')
      .selectAll('SystemExam')
      .$if(!!include?.curriculum, (qb) =>
        qb.select(({ selectFrom }) =>
          jsonObjectFrom(
            selectFrom('Curriculum')
              .selectAll('Curriculum')
              .whereRef('SystemExam.curriculumId', '=', 'Curriculum.id')
              .$if(
                typeof include?.curriculum == 'object' &&
                  !!include?.curriculum?.track,
                (qb) =>
                  qb.select(({ selectFrom }) =>
                    jsonObjectFrom(
                      selectFrom('Track')
                        .selectAll('Track')
                        .whereRef('Curriculum.trackId', '=', 'Track.id')
                        .$if(
                          typeof include?.curriculum !== 'boolean' &&
                            typeof include?.curriculum?.track !== 'boolean' &&
                            !!include?.curriculum?.track?.course,
                          (qb) =>
                            qb.select(({ selectFrom }) =>
                              jsonObjectFrom(
                                selectFrom('Course')
                                  .selectAll('Course')
                                  .whereRef('Track.courseId', '=', 'Course.id'),
                              ).as('course'),
                            ),
                        ),
                    ).as('track'),
                  ),
              ),
          ).as('curriculum'),
        ),
      )
      .$if(!!include?.cycle, (qb) =>
        qb.select(({ selectFrom }) =>
          jsonObjectFrom(
            selectFrom('Cycle')
              .selectAll('Cycle')
              .whereRef('SystemExam.cycleId', '=', 'Cycle.id'),
          ).as('cycle'),
        ),
      )
    return query
  }

  public async applyFilters<O>(
    query: SelectQueryBuilder<DB, 'SystemExam', O>,
    filters: FiltersInput | undefined,
  ): Promise<SelectQueryBuilder<DB, 'SystemExam', O>> {
    if (filters !== undefined) {
      const { curriculumId, cycleId, type } = filters
      if (curriculumId !== undefined)
        query = query.where('curriculumId', '=', curriculumId)
      if (cycleId !== undefined) query = query.where('cycleId', '=', cycleId)
      if (type !== undefined) query = query.where('type', '=', type)
    }
    return query
  }
}
