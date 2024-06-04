import { type Expression, type SqlBool, type ExpressionBuilder } from 'kysely'
import { type Session } from 'next-auth'
import type { DB } from '~/kysely/types'

export function whereCanReadQuiz(session: Session) {
  return (eb: ExpressionBuilder<DB, 'Quiz'>) => {
    const conds: Expression<SqlBool>[] = []
    if (session.user.role === 'STUDENT') {
      conds.push(eb('Quiz.examineeId', '=', session.user.id))
    } else if (session.user.role === 'CORRECTOR') {
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
                  .where('UserCycle.userId', '=', session.user.id)
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
