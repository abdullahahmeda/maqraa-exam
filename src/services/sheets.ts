import { z } from 'zod'
import { prisma } from '../server/db'
import sheets from '../utils/sheets'
import { questionSchema } from '../validation/questionSchema'
import { userSchema } from '../validation/userSchema'

// const googleSheetErrorHandler = (error: any) => {
//   if (error instanceof GaxiosError) {
//     if (Number(error.code) === 404) {
//       throw new TRPCError({
//         code: 'NOT_FOUND',
//         message: 'هذا الملف غير موجود',
//       })
//     }
//     if (Number(error.code) === 403 || Number(error.code) === 400) {
//       throw new TRPCError({
//         code: 'FORBIDDEN',
//         message: 'الصلاحيات غير كافية، تأكد من تفعيل مشاركة الملف',
//       })
//     }
//   }

//   throw new TRPCError({
//     code: 'INTERNAL_SERVER_ERROR',
//     message: 'حدث خطأ غير متوقع',
//   })
// }

// export const importQuestions = async (
//   rows: string[][],
//   course: number,
//   removeOldQuestions: boolean
// ) => {
//   let rows
//   try {
//     rows = await getFields(spreadsheetId, input.sheet)
//   } catch (error) {
//     throw googleSheetErrorHandler(error)
//   }
//   const questions: z.infer<typeof questionSchema>[] = []
//   for (const [i, row] of rows.entries()) {
//     if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆
//     const _question = {
//       number: Number(row[0]),
//       pageNumber: Number(row[1]),
//       partNumber: Number(row[2]),
//       hadithNumber: Number(row[3]),
//       type: row[4],
//       style: row[5],
//       difficulty: row[6],
//       text: row[7],
//       textForTrue: row[8],
//       textForFalse: row[9],
//       option1: row[10],
//       option2: row[11],
//       option3: row[12],
//       option4: row[13],
//       answer: row[14],
//       courseId: course,
//     }

//     const question = questionSchema.parse(_question, {
//       path: [i + 1],
//     })
//     questions.push(question)
//   }

//   const createQuestions = prisma.question.createMany({
//     data: questions,
//   })

//   if (removeOldQuestions) {
//     await prisma.$transaction([prisma.question.deleteMany(), createQuestions])
//   } else await createQuestions
// }

// export const importUsers = async (rows: string[][]) => {
//   const users: z.infer<typeof userSchema>[] = []
//   for (const [i, row] of rows.entries()) {
//     if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆
//     const _user = {
//       name: row[0],
//       email: row[1],
//       role: row[2],
//     }

//     const user = userSchema.parse(_user, {
//       path: [i + 1],
//     })
//     users.push(user)
//   }

//   await prisma.user.createMany({
//     data: users,
//   })
// }

export const getFields = async (spreadsheetId: string, sheet: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'${sheet}'!A:R`,
  })

  return response.data.values as string[][]
}

export const getSheets = async (spreadsheetId: string) => {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  })

  return response.data.sheets?.map(
    (sheet) => sheet.properties?.title
  ) as string[]
}
