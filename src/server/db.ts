import { DeduplicateJoinsPlugin, Kysely } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import ws from 'ws'
import { env } from '~/env.mjs'
import { DB } from '~/kysely/types'

export const db = new Kysely<DB>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL,
    webSocketConstructor: ws,
  }),
  plugins: [new DeduplicateJoinsPlugin()],
  log: env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})
