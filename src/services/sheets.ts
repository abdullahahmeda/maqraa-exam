import { z } from 'zod'
import { prisma } from '../server/db'
import sheets from '../utils/sheets'
import { questionSchema } from '../validation/questionSchema'
import { studentSchema } from '../validation/studentSchema'

// const headers = [
//   'رقم السؤال',
//   'رقم الصفحة ',
//   'رقم الجزء',
//   'رقم الحديث',
//   'نوع السؤال',
//   'طريقة السؤال',
//   'مستوى السؤال',
//   'السؤال',
//   'صح',
//   'خطأ',
//   'خيار1',
//   'خيار2',
//   'خيار3',
//   'خيار4',
//   'الإجابة'
// ]

// function arraysEqual (a: [], b: []) {
//   if (a === b) return true
//   if (a == null || b == null) return false
//   if (a.length !== b.length) return false

//   // If you don't care about the order of the elements inside
//   // the array, you should sort both arrays here.
//   // Please note that calling sort on an array will modify that array.
//   // you might want to clone your array first.

//   for (let i = 0; i < a.length; ++i) {
//     if (a[i] !== b[i]) return false
//   }
//   return true
// }

export const importQuestions = async (
  rows: string[][],
  course: number,
  removeOldQuestions: boolean
) => {
  const questions: z.infer<typeof questionSchema>[] = []
  for (const [i, row] of rows.entries()) {
    if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆
    const _question = {
      number: Number(row[0]),
      pageNumber: Number(row[1]),
      partNumber: Number(row[2]),
      hadithNumber: Number(row[3]),
      type: row[4],
      style: row[5],
      difficulty: row[6],
      text: row[7],
      trueText: row[8],
      falseText: row[9],
      option1: row[10],
      option2: row[11],
      option3: row[12],
      option4: row[13],
      answer: row[14],
      courseId: course
    }

    const question = questionSchema.parse(_question, {
      path: [i + 1]
    })
    questions.push(question)
  }

  const createQuestions = prisma.question.createMany({
    data: questions
  })

  if (removeOldQuestions) {
    await prisma.$transaction([prisma.question.deleteMany(), createQuestions])
  } else await createQuestions
}

export const importStudents = async (rows: string[][]) => {
  const students: z.infer<typeof studentSchema>[] = []
  for (const [i, row] of rows.entries()) {
    if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆
    const _student = {
      email: row[0]
    }

    const student = studentSchema.parse(_student, {
      path: [i + 1]
    })
    students.push(student)
  }

  // await prisma.question.createMany({
  //   data: students
  // })

  // TODO: add users
}

export const getFields = async (spreadsheetId: string, sheet: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'${sheet}'!A:O`
  })

  return response.data.values as string[][]
}

export const getSheets = async (spreadsheetId: string) => {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId
  })

  return response.data.sheets?.map(sheet => sheet.properties?.title) as string[]
}
