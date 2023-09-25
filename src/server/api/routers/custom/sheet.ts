import { TRPCError } from '@trpc/server'
import { z, ZodError } from 'zod'
import {
  getSheets,
} from '~/services/sheets'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import {
  spreadsheetUrlSchema,
} from '~/validation/importQuestionsSchema'
import { GaxiosError } from 'gaxios'

import {
  createTRPCRouter,
  adminOnlyProcedure,
} from '../../trpc'

const googleSheetErrorHandler = (error: any) => {
  if (error instanceof GaxiosError) {
    if (Number(error.code) === 404) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'هذا الملف غير موجود',
      })
    }
    if (Number(error.code) === 403 || Number(error.code) === 400) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'الصلاحيات غير كافية، تأكد من تفعيل مشاركة الملف',
      })
    }
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'حدث خطأ غير متوقع',
  })
}

export const sheetRouter = createTRPCRouter({
  listSheets: adminOnlyProcedure
    .input(
      z.object({
        url: spreadsheetUrlSchema,
      })
    )
    .query(async ({ input }) => {
      const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

      let sheets
      try {
        sheets = await getSheets(spreadsheetId)
      } catch (error) {
        throw googleSheetErrorHandler(error)
      }

      return sheets
    }),

  // importQuestions: adminOnlyProcedure
  //   .input(importQuestionsSchema)
  //   .mutation(async ({ input }) => {
  //     const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

  //     let rows
  //     try {
  //       rows = await getFields(spreadsheetId, input.sheet)
  //     } catch (error) {
  //       throw googleSheetErrorHandler(error)
  //     }

  //     try {
  //       await importQuestions(rows, input.course)
  //     } catch (error: any) {
  //       if (error instanceof ZodError) {
  //         const issue = error.issues[0]!

  //         const [rowNumber, field] = issue.path

  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
  //           cause: issue,
  //         })
  //       }

  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'حدث خطأ غير متوقع',
  //       })
  //     }
  //     return true
  //   }),
  // importUsers: adminOnlyProcedure
  //   .input(importUsersSchema)
  //   .mutation(async ({ input }) => {
  //     const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

  //     let rows
  //     try {
  //       rows = await getFields(spreadsheetId, input.sheet)
  //     } catch (error) {
  //       throw googleSheetErrorHandler(error)
  //     }

  //     try {
  //       await importUsers(rows)
  //     } catch (error: any) {
  //       if (error instanceof ZodError) {
  //         const issue = error.issues[0]!

  //         const [rowNumber, field] = issue.path

  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
  //           cause: issue,
  //         })
  //       }

  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'حدث خطأ غير متوقع',
  //       })
  //     }
  //     return true
  //   }),
})
