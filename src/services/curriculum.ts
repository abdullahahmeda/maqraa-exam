import { PrismaClient } from '@prisma/client'
import { checkMutate } from '~/server/api/routers/custom/helper'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'

export class CurriculumService {
  private db

  public constructor(db: PrismaClient) {
    this.db = db
  }

  public async create(input: any) {
    // TODO: implement this
    throw new Error('not implemented')
  }

  public async update(input: any) {
    const { id, parts, ...data } = editCurriculumSchema.parse(input)

    return await this.db.$transaction(async (tx) => {
      await checkMutate(
        tx.curriculumPart.deleteMany({ where: { curriculumId: id } })
      )
      return await checkMutate(
        tx.curriculum.update({
          where: { id },
          data: {
            ...data,
            parts: { create: parts },
          },
        })
      )
    })
  }

  public async getAllQuestions(id: string) {
    const parts = await this.db.curriculumPart.findMany({
      where: { curriculumId: id },
      select: { from: true, to: true, number: true },
    })
    const questions = await this.db.question.findMany({
      where: {
        OR: parts.map((part) => ({
          partNumber: part.number,
          hadithNumber: {
            gte: part.from,
            lte: part.to,
          },
        })),
      },
    })
    return questions
  }
}
