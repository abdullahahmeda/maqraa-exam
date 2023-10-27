import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

import { env } from '../env.mjs'

neonConfig.webSocketConstructor = ws
const connectionString = `${env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

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
