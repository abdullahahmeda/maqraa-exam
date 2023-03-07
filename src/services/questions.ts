import { PageOptions } from '../types'
import { prisma } from '../server/db'

export const getPaginatedQuestions = async ({
  page,
  pageSize
}: PageOptions) => {
  return {
    questions: await prisma.question.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    count: await prisma.question.count()
  }
}
