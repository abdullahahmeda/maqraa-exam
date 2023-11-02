import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'
import * as util from 'util'

import { env } from '../env.mjs'

neonConfig.webSocketConstructor = ws
const connectionString = `${env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export let prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV === 'development') {
  prisma = prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now()
          const result = await query(args)
          const end = performance.now()
          const time = end - start
          console.log(
            util.inspect(
              { model, operation, args, time },
              { showHidden: false, depth: null, colors: true }
            )
          )
          return result
        },
      },
    },
  }) as any
}

// export const prisma = xprisma.$extends({
//   result: {
//     student: {
// getOverallPerformance: {
//   needs: { userId: true },
//   compute(student) {
//     return async () => {
//       const quizzes = await xprisma.quiz.findMany({
//         where: {
//           examineeId: student.userId,
//           grade: { not: null },
//           systemExamId: { not: null },
//         },
//         include: {
//           groups: { select: { questions: { select: { id: true } } } },
//         },
//       })
//       if (quizzes.length === 0) return null
//       const average =
//         (quizzes.reduce(
//           (acc, exam) =>
//             acc +
//             exam.grade! / exam.groups.flatMap((g) => g.questions).length,
//           0
//         ) *
//           100) /
//         quizzes.length
//       return average
//     }
//   },
// },
// },
// curriculum: {
// getQuestions: {
//   needs: { id: true },
//   compute(curriculum) {
//     return async () => {}
//   },
// },
//     },
//   },
// })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
