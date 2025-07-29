import { db } from '~/server/db'
import { type Expression, type SqlBool, type ExpressionBuilder } from 'kysely'
import { type User } from 'next-auth'
import type { DB } from '~/kysely/types'
import { type ListQuizSchema } from '~/validation/backend/queries/quiz/list'
import { applyPagination } from '~/utils/db'
import { type FiltersSchema } from '~/validation/backend/queries/quiz/common'

function applyFilters(filters: FiltersSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Quiz'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.systemExamId !== undefined) {
      if (filters.systemExamId === null)
        where.push(eb('Quiz.systemExamId', 'is', null))
      else if (filters.systemExamId === 'not_null')
        where.push(eb('Quiz.systemExamId', 'is not', null))
      else where.push(eb('Quiz.systemExamId', '=', filters.systemExamId))
    }
    if (filters?.examinee?.name)
      where.push(
        eb.exists(
          eb
            .selectFrom('User')
            .where('User.name', 'like', `%${filters.examinee.name}%`)
            .whereRef('Quiz.examineeId', '=', 'User.id'),
        ),
      )
    return eb.and(where)
  }
}

export function whereCanReadQuiz(user: User | undefined) {
  return (eb: ExpressionBuilder<DB, 'Quiz'>) => {
    if (user === undefined) {
      return eb.and([eb(eb.lit(1), '!=', eb.lit(1))])
    }
    const conds: Expression<SqlBool>[] = []
    if (user.role === 'STUDENT') {
      conds.push(eb('Quiz.examineeId', '=', user.id))
    } else if (user.role === 'CORRECTOR') {
      conds.push(
        eb('Quiz.systemExamId', 'is not', null),
        eb.exists(
          eb
            .selectFrom('SystemExam')
            .whereRef('SystemExam.id', '=', 'Quiz.systemExamId')
            .where((eb) =>
              eb.exists(
                eb
                  .selectFrom('UserCycle')
                  .where('UserCycle.userId', '=', user.id)
                  .whereRef(
                    'UserCycle.curriculumId',
                    '=',
                    'SystemExam.curriculumId',
                  )
                  .whereRef('UserCycle.cycleId', '=', 'SystemExam.cycleId'),
              ),
            ),
        ),
      )
    }
    return eb.and(conds)
  }
}

export async function getQuizList(
  input: ListQuizSchema & { user: User },
  context: 'exam-table',
) : ReturnType<typeof _getQuizTableListForExam>
export async function getQuizList(
  input: ListQuizSchema & { user: User },
  context: 'student-table',
) : ReturnType<typeof _getQuizTableListForStudent>
export async function getQuizList(
  input: ListQuizSchema & { user: User },
  context: 'exam-table' | 'student-table',
) {
  switch (context) {
    case 'exam-table':
      return _getQuizTableListForExam(input)
    case 'student-table':
      return _getQuizTableListForStudent(input)
  }
}
async function _getQuizTableListForStudent(
  { user, ...input }: (ListQuizSchema & { user: User | undefined }) | undefined,
) {
  const where = applyFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .where(whereCanReadQuiz(user))
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('Quiz')
      .selectAll('Quiz')
      .innerJoin('SystemExam', 'Quiz.systemExamId', 'SystemExam.id')
      .leftJoin('User as Corrector', 'Quiz.correctorId', 'Corrector.id')
      .innerJoin('Model', 'Quiz.modelId', 'Model.id')
      .select([
        'SystemExam.name as systemExamName',
        'Corrector.name as correctorName',
        'Model.total as modelTotal',
      ])
      .where(where)
      .where(whereCanReadQuiz(user)),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

async function _getQuizTableListForExam(
  { user, ...input }: (ListQuizSchema & { user: User | undefined }) | undefined,
) {
  const where = applyFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .where(whereCanReadQuiz(user))
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('Quiz')
      .selectAll('Quiz')
      .innerJoin('User as Examinee', 'Quiz.examineeId', 'Examinee.id')
      .leftJoin('User as Corrector', 'Quiz.correctorId', 'Corrector.id')
      .innerJoin('Model', 'Quiz.modelId', 'Model.id')
      .select([
        'Examinee.name as examineeName',
        'Examinee.email as examineeEmail',
        'Corrector.name as correctorName',
        'Model.total as modelTotal',
      ])
      .where(where)
      .where(whereCanReadQuiz(user)),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}
