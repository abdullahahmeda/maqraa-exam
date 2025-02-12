import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getGoogleSheetsNames } from '~/services/sheet'
import { getSpreadsheetIdFromURL } from '~/utils/strings'
import { spreadsheetUrlSchema } from '~/validation/importQuestionsSchema'
import { GaxiosError } from 'gaxios'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

const googleSheetErrorHandler = (error: unknown) => {
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
  listSheetNames: protectedProcedure
    .input(z.object({ url: spreadsheetUrlSchema }))
    .query(async ({ input, ctx }) => {
      if (!ctx.session.user.role.includes('ADMIN'))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحيات لهذه العملية',
        })
      const spreadsheetId = getSpreadsheetIdFromURL(input.url)!

      let sheets
      try {
        sheets = await getGoogleSheetsNames(spreadsheetId)
      } catch (error) {
        throw googleSheetErrorHandler(error)
      }

      return sheets
    }),
})
