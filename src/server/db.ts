import {
  DeduplicateJoinsPlugin,
  Kysely,
  PostgresDialect,
  MssqlDialect,
} from 'kysely'
import { NeonDialect } from 'kysely-neon'
import { env } from '~/env.js'
import type { DB } from '~/kysely/types'
import type { DB as MSSQLDB } from '~/kysely/mssql-types'
import { Pool } from 'pg'
import * as tedious from 'tedious'
import * as tarn from 'tarn'

export const db =
  env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({ connectionString: env.DATABASE_URL }),
        }),
        plugins: [new DeduplicateJoinsPlugin()],
        log(event) {
          if (event.level === 'query') {
            console.log(`
  -------------------
  ${event.query.sql}
  * Parametrs: ${event.query.parameters.toString()}
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
          // webSocketConstructor: ws,
        }),
        plugins: [new DeduplicateJoinsPlugin()],
        log: ['error'],
      })

const mssqlDialect = new MssqlDialect({
  tarn: {
    ...tarn,
    options: {
      min: 0,
      max: 10,
    },
  },
  tedious: {
    ...tedious,
    connectionFactory: () =>
      new tedious.Connection({
        authentication: {
          options: {
            userName: env.MSSQL_USER,
            password: env.MSSQL_PASSWORD,
          },
          type: 'default',
        },
        options: {
          database: env.MSSQL_DB,
          port: 1433,
          trustServerCertificate: true,
        },
        server: env.MSSQL_HOST,
      }),
  },
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const mssqlDB = new Kysely<MSSQLDB>({ dialect: mssqlDialect })
