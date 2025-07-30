import { db } from '~/server/db'
import { sql } from 'kysely'
import { type Expression, type ExpressionBuilder, type SqlBool } from 'kysely'
import { type User } from 'next-auth'
import type { DB } from '~/kysely/types'
import { type FiltersSchema } from '~/validation/backend/queries/exam/common'
import { type ListExamsSchema } from '~/validation/backend/queries/exam/list'
import { type AddStudentToExamSchema } from '~/validation/backend/mutations/exam/addStudentToExam'
import { applyPagination } from '~/utils/db'

export async function getExamList(
  input: { user: User } & (ListExamsSchema | undefined),
  context: 'table',
) {
  switch (context) {
    case 'table':
      return _getExamTableList(input)
  }
}

async function _getExamTableList({
  user,
  ...input
}: { user: User } & (ListExamsSchema | undefined)) {
  const where = applyExamsFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('SystemExam')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .where(whereCanReadExam(user))
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('SystemExam')
      .selectAll('SystemExam')
      .innerJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
      .innerJoin('Curriculum', 'SystemExam.curriculumId', 'Curriculum.id')
      .innerJoin('Track', 'Curriculum.trackId', 'Track.id')
      .innerJoin('Course', 'Track.courseId', 'Course.id')
      .select([
        'Cycle.name as cycleName',
        'Curriculum.name as curriculumName',
        'Track.name as trackName',
        'Course.name as courseName',
      ])
      .where(where)
      .where(whereCanReadExam(user)),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export async function getExam(
  { id, user }: { id: string; user: User | undefined },
  context: 'show',
): ReturnType<typeof _getExamDataForShow>
export async function getExam(
  { id }: { id: string },
  context?: 'base',
): ReturnType<typeof _getExam>
export async function getExam(
  { id, user }: { id: string; user?: User | undefined },
  context: 'show' | 'base' = 'base',
) {
  switch (context) {
    case 'show':
      return _getExamDataForShow({ id, user })
    case 'base':
    default:
      return _getExam({ id })
  }
}

function _getExam({ id }: { id: string }) {
  return db
    .selectFrom('SystemExam')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

function _getExamDataForShow({
  id,
  user,
}: {
  id: string
  user: User | undefined
}) {
  return db
    .selectFrom('SystemExam')
    .where('SystemExam.id', '=', id)
    .where(whereCanReadExam(user))
    .leftJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
    .leftJoin('Curriculum', 'SystemExam.curriculumId', 'Curriculum.id')
    .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
    .leftJoin('Course', 'Track.courseId', 'Course.id')
    .selectAll('SystemExam')
    .select([
      'Course.name as courseName',
      'Curriculum.name as curriculumName',
      'Cycle.name as cycleName',
    ])
    .executeTakeFirst()
}

export async function getExamStats({ id }: { id: string }) {
  const quizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .executeTakeFirst()
    )?.total,
  )

  const submittedQuizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .where('submittedAt', 'is not', null)
        .executeTakeFirst()
    )?.total,
  )

  const correctedQuizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .where('correctorId', 'is not', null)
        .executeTakeFirst()
    )?.total,
  )

  const avgStats = await db
    .selectFrom('Quiz')
    .select(({ fn }) => [
      fn.avg('grade').as('gradeAvg'),
      fn.avg('percentage').as('percentageAvg'),
    ])
    .where('systemExamId', '=', id)
    .where('correctedAt', 'is not', null)
    .executeTakeFirstOrThrow()

  const submissionsDates = await db
    .selectFrom('Quiz')
    .select(({ fn }) => [
      fn.count<string>('id').as('total'),
      sql`CAST(${sql.ref('submittedAt')} AS DATE)`.as('submittedAt'),
    ])
    .where('systemExamId', '=', id)
    .where('submittedAt', 'is not', null)
    .groupBy(sql`CAST(${sql.ref('submittedAt')} AS DATE)`)
    .$narrowType<{ submittedAt: Date }>()
    .execute()
  return {
    quizCount,
    submittedQuizCount,
    correctedQuizCount,
    avgStats,
    submissionsDates,
  }
}

export async function addStudentToExam({
  userId,
  examId,
}: AddStudentToExamSchema) {
  const exam = await getExam({ id: examId })
  if (!exam) throw new Error('Exam not found')
  return db
    .insertInto('Quiz')
    .values({
      type: exam.type,
      examineeId: userId,
      curriculumId: exam.curriculumId,
      systemExamId: examId,
      modelId: exam.defaultModelId,
    })
    .execute()
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
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}

export function whereCanReadExam(user: User | undefined) {
  return (eb: ExpressionBuilder<DB, 'SystemExam'>) => {
    if (user === undefined) {
      // basically, a falsy condition to not fetch any rows
      return eb.and([eb(eb.lit(1), '!=', eb.lit(1))])
    }
    const where: Expression<SqlBool>[] = []
    // if not admin and superadmin
    if (!user.role.includes('ADMIN'))
      where.push(
        eb.exists(
          eb
            .selectFrom('UserCycle')
            .where('UserCycle.userId', '=', user.id)
            .whereRef('UserCycle.curriculumId', '=', 'SystemExam.curriculumId')
            .whereRef('UserCycle.cycleId', '=', 'SystemExam.cycleId'),
        ),
      )
    return eb.and(where)
  }
}
