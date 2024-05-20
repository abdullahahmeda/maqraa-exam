import { DeduplicateJoinsPlugin, Kysely, PostgresDialect } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import ws from 'ws'
import { env } from '~/env.js'
import type { DB } from '~/kysely/types'
import { Pool } from 'pg'

export const db =
  env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: env.DATABASE_URL,
          }),
        }),
        plugins: [new DeduplicateJoinsPlugin()],
        log(event) {
          if (event.level === 'query') {
            console.log(`
-------------------
${event.query.sql}
* Parametrs: ${event.query.parameters}
* Took: ${event.queryDurationMillis} ms
`)
          } else {
            console.log(event)
          }
        },
      })
    : new Kysely<DB>({
        dialect: new NeonDialect({
          connectionString: env.DATABASE_URL,
          webSocketConstructor: ws,
        }),
        plugins: [new DeduplicateJoinsPlugin()],
        log: ['error'],
      })
