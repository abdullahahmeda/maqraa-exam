import type { PrismaClient } from '@prisma/client'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { QuizService } from './quiz'

export class SystemExamService {
  private db

  public constructor(db: PrismaClient) {
    this.db = db
  }

  public async create(input: any) {
    const { groups, trackId, courseId, ...data } =
      newSystemExamSchema.parse(input)

    const quizService = new QuizService(this.db)
    await quizService.validateSufficientQeustionsInGroups({
      type: data.type,
      groups,
      curriculumId: data.curriculumId,
      repeatFromSameHadith: data.repeatFromSameHadith,
    })

    const cycleStudents = await this.db.student.findMany({
      where: { cycles: { some: { cycleId: data.cycleId } } },
    })

    return await this.db.$transaction(async (trx) => {
      const questionGroups = await Promise.all(
        groups.map((g, i) =>
          trx.questionsGroup.create({ data: { ...g, order: i + 1 } })
        )
      )
      const groupsIds = questionGroups.map(({ id }) => ({ id }))
      return await trx.systemExam.create({
        data: {
          ...data,
          groups: { connect: groupsIds },
          quizzes: {
            create: cycleStudents.map(({ userId }) => ({
              endsAt: data.endsAt,
              curriculumId: data.curriculumId,
              groups: { connect: groupsIds },
              repeatFromSameHadith: data.repeatFromSameHadith,
              type: data.type,
              examineeId: userId,
            })),
          },
        },
      })
    })
  }
}
