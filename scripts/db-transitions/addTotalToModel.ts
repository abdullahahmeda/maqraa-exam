export const f = 'n'
// import 'dotenv/config'
// import { Kysely, PostgresDialect } from 'kysely'
// import { NeonDialect } from 'kysely-neon'
// import { type DB } from '../../src/kysely/types'
// import PG from 'pg'

// function makeDBConnection() {
//   return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
//     ? new Kysely<DB>({
//         dialect: new PostgresDialect({
//           pool: new PG.Pool({
//             connectionString: process.env.DATABASE_URL,
//           }),
//         }),
//       })
//     : new Kysely<DB>({
//         dialect: new NeonDialect({
//           connectionString: process.env.DATABASE_URL,
//         }),
//       })
// }

// async function main() {
//   const db = makeDBConnection()
//   try {
//     const result = await db
//       .updateTable('Model')
//       .from('Quiz')
//       .set((eb) => ({
//         total: eb.ref('Quiz.total'),
//       }))
//       .whereRef('Quiz.modelId', '=', 'Model.id')
//       .executeTakeFirstOrThrow()
//     console.log(`[Success]: ${result.numUpdatedRows} rows have been updated.`)
//     const result2 = await db
//       .deleteFrom('Model')
//       .where('total', 'is', null)
//       .executeTakeFirstOrThrow()
//     console.log(`[Success]: ${result2.numDeletedRows} rows have been deleted.`)
//   } catch (error: unknown) {
//     console.error(`[ERROR]: `)
//     console.log(error)
//   }
// }

// void main()
