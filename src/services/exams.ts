import { z } from 'zod'
import type { PrismaClient } from '@prisma/client'
import { correctExamSchema } from '~/validation/correctExamSchema'

export class ExamsService {
  private db

  public constructor(db: PrismaClient) {
    this.db = db
  }

  public async correct(input: any) {
    const data = correctExamSchema
      .extend({ correctorId: z.string().min(1) })
      .parse(input)

    const { id, groups, correctorId } = data

    let examGrade = 0
    const update = Object.entries(groups).map(([groupId, { questions }]) => ({
      where: { id: groupId },
      data: {
        questions: {
          update: Object.entries(questions).map(
            ([questionId, questionGrade]) => {
              examGrade += questionGrade

              return {
                where: { id: Number(questionId) },
                data: { grade: questionGrade },
              }
            }
          ),
        },
      },
    }))

    return this.db.exam.update({
      where: { id },
      data: {
        correctedAt: new Date(),
        corrector: { connect: { id: correctorId } },
        grade: examGrade,
        groups: { update },
      },
    })
  }
}
