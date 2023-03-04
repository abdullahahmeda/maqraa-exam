import { TRPCError } from '@trpc/server'
import { z, ZodError } from 'zod'
import { getFields, getSheets, importQuestions } from '../../../services/sheets'
import { getSpreadsheetIdFromURL } from '../../../utils/sheets'
import {
  importQuestionsSchema,
  spreadsheetUrlSchema
} from '../../../validation/importQuestionsSchema'
import { GaxiosError } from 'gaxios'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { logErrorToLogtail } from '../../../utils/logtail'

const googleSheetErrorHandler = (error: any) => {
  if (error instanceof GaxiosError) {
    if (Number(error.code) === 404) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'هذا الملف غير موجود'
      })
    }
    if (Number(error.code) === 403 || Number(error.code) === 400) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'الصلاحيات غير كافية، تأكد من تفعيل مشاركة الملف'
      })
    }
  }

  logErrorToLogtail(error)
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'حدث خطأ غير متوقع'
  })
}

export const sheetsRouter = createTRPCRouter({
  listSheets: publicProcedure
    .input(
      z.object({
        url: spreadsheetUrlSchema
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

  importQuestions: publicProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ input }) => {
      const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

      let rows
      try {
        rows = await getFields(spreadsheetId, input.sheet)
      } catch (error) {
        throw googleSheetErrorHandler(error)
      }

      try {
        await importQuestions(rows, input.removeOldQuestions)
      } catch (error: any) {
        if (error instanceof ZodError) {
          const issue = error.issues[0]!

          const [rowNumber, field] = issue.path

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
            cause: issue
          })
        }

        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    })
})
