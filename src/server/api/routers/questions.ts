import { ZodError, z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { checkMutate, checkRead, db } from './schemas/helper'
import { QuestionSchema } from './schemas/Question.schema'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { questionSchema } from '~/validation/questionSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { getFields } from '~/services/sheets'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'

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

  throw error
}

export const questionsRouter = createTRPCRouter({
  import: protectedProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      const spreadsheetId = getSpreadsheetIdFromURL(input.url) as string

      let rows
      try {
        rows = await getFields(spreadsheetId, input.sheet)
      } catch (error) {
        throw googleSheetErrorHandler(error)
      }
      const questions: z.infer<typeof questionSchema>[] = []
      for (const [i, row] of rows.entries()) {
        if (i === 0) continue // TODO: validate sheet headers are equal to `headers` 👆
        try {
          questions.push(
            questionSchema.parse(
              {
                number: Number(row[0]),
                pageNumber: Number(row[1]),
                partNumber: Number(row[2]),
                hadithNumber: Number(row[3]),
                type: row[4],
                style: row[5],
                difficulty: row[6],
                text: row[7],
                textForTrue: row[8],
                textForFalse: row[9],
                option1: row[10],
                option2: row[11],
                option3: row[12],
                option4: row[13],
                answer: row[14],
                courseId: input.course,
              },
              { path: [i + 1] }
            )
          )
        } catch (error) {
          if (error instanceof ZodError) {
            const issue = error.issues[0]!

            const [rowNumber, field] = issue.path

            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `خطأ في الصف رقم ${rowNumber}: الحقل ${field} ${issue.message}`,
              cause: issue,
            })
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'حدث خطأ غير متوقع',
          })
        }
      }

      console.log(rows, questions)

      return checkMutate(db(ctx).question.createMany({ data: questions }))
    }),

  count: protectedProcedure
    .input(QuestionSchema.count)
    .query(async ({ ctx, input }) =>
      checkMutate(db(ctx).question.count(input))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).question.delete({ where: { id: input } }))
    ),

  findFirst: protectedProcedure
    .input(QuestionSchema.findFirst.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).question.findFirst(input))),

  findMany: protectedProcedure
    .input(QuestionSchema.findMany.optional())
    .query(({ ctx, input }) => checkRead(db(ctx).question.findMany(input))),
})
