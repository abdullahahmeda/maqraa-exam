import { db } from '~/server/db'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import { type Session } from 'next-auth'
import type { DB } from '~/kysely/types'
import {
  type FiltersSchema,
  type IncludeSchema,
} from '~/validation/backend/queries/exam/common'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { type AddStudentToExamSchema } from '~/validation/backend/mutations/exam/addStudentToExam'

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

export function getExam(id: string) {
  return db.selectFrom('SystemExam').selectAll().where('id', '=', id).executeTakeFirst()
}

export async function addStudentToExam({ userId, examId }: AddStudentToExamSchema) {
  const exam = await getExam(examId)
  if (!exam) throw new Error('Exam not found')
  return db.insertInto('Quiz').values({
    type: exam.type,
    examineeId: userId,
    curriculumId: exam.curriculumId,
    systemExamId: examId,
    modelId: exam.defaultModelId
  }).execute()
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
  console.log('Query worked')
  let query = db.deleteFrom('SystemExam')
  if (ids !== undefined) query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}

export function whereCanReadExam(session: Session) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    const conds = []
    if (!session.user.role.includes('ADMIN'))
      conds.push(
        eb.exists(
          eb
            .selectFrom('UserCycle')
            .where('UserCycle.userId', '=', session.user.id)
            .whereRef('UserCycle.curriculumId', '=', 'SystemExam.curriculumId')
            .whereRef('UserCycle.cycleId', '=', 'SystemExam.cycleId'),
        ),
      )
    return eb.and(conds)
  }
}
