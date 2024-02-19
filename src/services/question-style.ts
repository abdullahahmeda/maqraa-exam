import { DB } from '~/kysely/types'
import { db } from '~/server/db'
import { NewQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { Service } from './Service'

export class QuestionStyleService extends Service<DB, 'QuestionStyle'> {
  protected baseSelectQuery = db.selectFrom('QuestionStyle')
  protected getBaseSelectQuery({ include }: { include?: undefined }) {
    const query = this.baseSelectQuery.selectAll()
    return query
  }

  public async create(params: NewQuestionStyleSchema) {
    // TODO: fix this type
    await db
      .insertInto('QuestionStyle')
      .values(params as any)
      .execute()
  }
}
