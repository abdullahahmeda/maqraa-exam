export const a = 'a'

// import { PageOptions } from '../types'
// import { prisma } from '../server/db'

// export const getPaginatedQuestions = async ({
//   page,
//   pageSize
// }: PageOptions) => {
//   return {
//     questions: await prisma.question.findMany({
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//       include: {
//         course: {
//           select: {
//             name: true
//           }
//         }
//       }
//     }),
//     count: await prisma.question.count()
//   }
// }
