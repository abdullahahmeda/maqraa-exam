import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { DB } from './types'
import { NeonDialect } from 'kysely-neon'
import ws from 'ws'

async function migrateToLatest() {
  const db = new Kysely<DB>({
    dialect: new NeonDialect({
      // connectionString: process.env.DATABASE_URL,
      connectionString:
        'postgres://abdullahahmeda:Pq4Qgd3DtXWa@ep-crimson-field-94272227.eu-central-1.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=10',
      webSocketConstructor: ws,
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
