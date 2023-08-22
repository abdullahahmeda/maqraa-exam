import { PrismaClient } from '@prisma/client'

import { env } from '../env.mjs'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const xprisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

export const prisma = xprisma.$extends({
  result: {
    student: {
      getOverallPerformance: {
        needs: { userId: true },
        compute(student) {
          return async () => {
            const exams = await xprisma.exam.findMany({
              where: {
                userId: student.userId,
                grade: { not: null },
                type: { not: 'PUBLIC' },
              },
              include: {
                groups: { select: { questions: { select: { id: true } } } },
              },
            })
            if (exams.length === 0) return null
            const average =
              (exams.reduce(
                (acc, exam) =>
                  acc +
                  exam.grade! / exam.groups.flatMap((g) => g.questions).length,
                0
              ) *
                100) /
              exams.length
            return average
          }
        },
      },
    },
  },
})

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = xprisma
