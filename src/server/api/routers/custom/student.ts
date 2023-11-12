import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'

export const UNUSED = true

// export const studentRouter = createTRPCRouter({
//   getStudentOverallPerformance: protectedProcedure
//     .input(z.string().min(1))
//     .query(async ({ input, ctx }) => {
//       const student = await checkRead(
//         db(ctx).student.findFirstOrThrow({ where: { id: input } })
//       )

//       return 'kofta'
//       // TODO: implement this
//       // return student.getOverallPerformance()
//     }),
// })
