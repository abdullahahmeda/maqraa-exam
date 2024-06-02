import 'dotenv/config'
import { Kysely, PostgresDialect } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import { type DB } from '../../src/kysely/types'
import PG from 'pg'

function makeDBConnection() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new PG.Pool({
            connectionString: process.env.DATABASE_URL,
          }),
        }),
      })
    : new Kysely<DB>({
        dialect: new NeonDialect({
          connectionString: process.env.DATABASE_URL,
        }),
      })
}

async function main() {
  const db = makeDBConnection()
  try {
    const result = await db
      .insertInto('CycleCurriculum')
      .columns(['curriculumId', 'cycleId'])
      .expression((eb) =>
        eb
          .selectFrom('UserCycle')
          .select(['UserCycle.curriculumId', 'UserCycle.cycleId'])
          .distinctOn(['UserCycle.curriculumId', 'UserCycle.cycleId']),
      )
      .executeTakeFirst()
    console.log(
      `[Success]: ${result.numInsertedOrUpdatedRows} rows have been inserted.`,
    )
  } catch (error: unknown) {
    console.error(`[ERROR]: `)
    console.log(error)
  }
}

void main()
