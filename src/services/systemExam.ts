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

    const total = groups.reduce(
      (acc, g) => acc + g.gradePerQuestion * g.questionsNumber,
      0
    )

    const students = await this.db.student.findMany({
      where: {
        cycles: {
          some: { cycleId: data.cycleId, curriculumId: data.curriculumId },
        },
      },
    })

    const questionGroups = await Promise.all(
      groups.map((g, i) =>
        this.db.questionsGroup.create({ data: { ...g, order: i + 1 } })
      )
    )
    const groupsIds = questionGroups.map(({ id }) => ({ id }))

    return await this.db.systemExam.create({
      data: {
        ...data,
        groups: { connect: groupsIds },
        quizzes: {
          create: students.map(({ userId }) => ({
            total,
            endsAt: data.endsAt,
            curriculumId: data.curriculumId,
            groups:
              // { connect: groupsIds },
              {
                create: groups.map((g, i) => ({ ...g, order: i + 1 })),
              },
            repeatFromSameHadith: data.repeatFromSameHadith,
            type: data.type,
            examineeId: userId,
          })),
        },
      },
    })
  }
}
