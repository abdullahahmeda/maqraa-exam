export const UNUSED = true

// import type { PrismaClient } from '@prisma/client'
// import { TRPCError } from '@trpc/server'
// import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
// import { QuizService } from './quiz'

// export class SystemExamService {
//   private db

//   public constructor(db: PrismaClient) {
//     this.db = db
//   }

//   public async create(input: any) {
//     const { groups, trackId, courseId, ...data } =
//       newSystemExamSchema.parse(input)

//     // const quizService = new QuizService(this.db)
//     // await quizService.validateSufficientQeustionsInGroups({
//     //   type: data.type,
//     //   groups,
//     //   curriculumId: data.curriculumId,
//     //   repeatFromSameHadith: data.repeatFromSameHadith,
//     // })

//     let total = 0
//     let questions: { questionId: string; weight: number }[] = []
//     let usedQuestions = new Set()
//     for (const group of groups) {
//       for (const question of Object.values(group.questions)) {
//         total += question.weight
//         if (usedQuestions.has(question.id))
//           throw new TRPCError({
//             code: 'BAD_REQUEST',
//             message: 'هناك أسئلة مكررة',
//           })
//         questions.push({ questionId: question.id, weight: question.weight })
//         usedQuestions.add(question.id)
//       }
//     }

//     const students = await this.db.student.findMany({
//       where: {
//         cycles: {
//           some: { cycleId: data.cycleId, curriculumId: data.curriculumId },
//         },
//       },
//     })

//     const descriptor = await this.db.questionsDescriptor.create({
//       data: {
//         groups: {
//           create: groups.map(({ questions, ...g }, i) => ({
//             ...g,
//             order: i + 1,
//           })),
//         },
//       },
//     })

//     const result = await this.db.systemExam.create({
//       data: {
//         ...data,
//         descriptorId: descriptor.id,
//         questions: {
//           create: questions.map((q, index) => ({ ...q, order: index + 1 })),
//         },
//         quizzes: {
//           create: students.map(({ userId }) => ({
//             total,
//             endsAt: data.endsAt,
//             curriculumId: data.curriculumId,
//             descriptorId: descriptor.id,
//             repeatFromSameHadith: data.repeatFromSameHadith,
//             type: data.type,
//             examineeId: userId,
//           })),
//         },
//       },
//     })
//     return result
//   }
// }
