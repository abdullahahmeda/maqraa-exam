import { DeduplicateJoinsPlugin, Kysely, PostgresDialect } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import ws from 'ws'
import { env } from '~/env.mjs'
import { DB } from '~/kysely/types'
import { Pool } from 'pg'

export const db =
  env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: env.DATABASE_URL,
          }),
        }),
        log: ['query', 'error'],
      })
    : new Kysely<DB>({
        dialect: new NeonDialect({
          connectionString: env.DATABASE_URL,
          webSocketConstructor: ws,
        }),
        plugins: [new DeduplicateJoinsPlugin()],
        log: ['error'],
      })
