import { ZodError, z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { questionSchema } from '~/validation/questionSchema'
import { getSpreadsheetIdFromURL } from '~/utils/sheets'
import { TRPCError } from '@trpc/server'
import { GaxiosError } from 'gaxios'
import { QuestionWhereInputObjectSchema } from '@zenstackhq/runtime/zod/objects'
import { db } from '~/server/db'
import XLSX from 'xlsx'
import { enDifficultyToAr, enStyleToAr, enTypeToAr } from '~/utils/questions'
import { exportSheet, importFromGoogleSheet } from '~/services/sheet'
import { applyFilters, applyPagination, paginationSchema } from '~/utils/db'
import {
  QuestionDifficulty,
  QuestionStyle,
  QuestionType,
  QuizType,
} from '~/kysely/enums'
import { SelectQueryBuilder } from 'kysely'
import { DB } from '~/kysely/types'

const questionFilterSchema = z.object({
  number: z
    .preprocess((v) => Number(v), z.number().int().safe().min(0).finite())
    .optional(),
  courseId: z.string().optional(),
  curriculum: z
    .object({
      id: z.string(),
      type: z.nativeEnum(QuizType),
    })
    .optional(),
  type: z.nativeEnum(QuestionType).optional(),
  style: z.nativeEnum(QuestionStyle).optional(),
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
})

function applyQuestionFilters<O>(
  query: SelectQueryBuilder<DB, 'Question', O>,
  filters: z.infer<typeof questionFilterSchema>
) {
  return applyFilters(query, filters, {
    curriculum: (query, curriculum) => query, // Custom handler below in `list`
  })
}

export const questionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        filters: questionFilterSchema,
        include: z
          .record(z.literal('course'), z.boolean().optional())
          .optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = applyPagination(
        applyQuestionFilters(
          ctx.db
            .selectFrom('Question')
            .selectAll('Question')
            .$if(!!input.include?.course, (qb) =>
              qb
                .leftJoin('Course', 'Question.courseId', 'Course.id')
                .select('Course.name as courseName')
            ),
          input.filters
        ),
        input.pagination
      )

      if (input.filters.curriculum) {
        const parts = await db
          .selectFrom('CurriculumPart')
          .where('curriculumId', '=', input.filters.curriculum.id)
          .select(['from', 'mid', 'to', 'number'])
          .execute()

        query = query.where((eb) =>
          eb.or(
            parts.map((part) => {
              let minLimit: number
              let maxLimit: number
              switch (input.filters.curriculum!.type) {
                case 'FIRST_MEHWARY':
                  minLimit = part.from
                  maxLimit = part.mid
                  break
                case 'SECOND_MEHWARY':
                  minLimit = Math.max(part.from, part.mid)
                  maxLimit = part.to
                  break
                case 'WHOLE_CURRICULUM':
                  minLimit = part.from
                  maxLimit = part.to
                  break
              }
              return eb.and([
                eb('hadithNumber', '>=', minLimit),
                eb('hadithNumber', '<=', maxLimit),
                eb('partNumber', '=', part.number),
              ])
            })
          )
        )
      }

      return await query.execute()
    }),
  count: protectedProcedure
    .input(z.object({ filters: questionFilterSchema.optional().default({}) }))
    .query(async ({ ctx, input }) => {
      const query = applyQuestionFilters(
        ctx.db
          .selectFrom('Question')
          .select(({ fn }) => fn.count<number>('id').as('total')),
        input.filters
      )
      const total = Number((await query.executeTakeFirst())?.total)
      return total
    }),
  import: protectedProcedure
    .input(importQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      const { url, sheetName, courseId } = input
      const spreadsheetId = getSpreadsheetIdFromURL(url) as string

      let data
      try {
        data = await importFromGoogleSheet({
          spreadsheetId,
          sheetName,
          mapper: (row) => ({
            number: row[0],
            pageNumber: row[1],
            partNumber: row[2],
            hadithNumber: row[3],
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
            anotherAnswer: row[15],
            isInsideShaded: row[16],
            objective: row[17],
            courseId,
          }),
          validationSchema: questionSchema,
        })
      } catch (error) {
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

      await ctx.db.insertInto('Question').values(data).execute()
      return true
    }),

  export: protectedProcedure
    .input(z.object({ where: QuestionWhereInputObjectSchema }).optional())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      const questions = await ctx.db
        .selectFrom('Question')
        .selectAll()
        .orderBy('number asc')
        .execute()

      return exportSheet(questions, (q) => ({
        'رقم السؤال': q.number,
        'رقم الصفحة': q.pageNumber,
        'رقم الجزء': q.partNumber,
        'رقم الحديث': q.hadithNumber,
        'نوع السؤال': enTypeToAr(q.type),
        'طريقة السؤال': enStyleToAr(q.style),
        'مستوى السؤال': enDifficultyToAr(q.difficulty),
        السؤال: q.text,
        صح: q.textForTrue,
        خطأ: q.textForFalse,
        خيار1: q.option1,
        خيار2: q.option2,
        خيار3: q.option3,
        خيار4: q.option4,
        الإجابة: q.answer,
        'هل يوجد إجابة أخرى': q.anotherAnswer,
        'داخل المظلل': q.isInsideShaded ? 'نعم' : 'لا',
        'يستهدف السؤال': q.objective,
      }))
    }),

  bulkDelete: protectedProcedure
    .input(z.array(z.string().min(1)))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك الصلاحيات لهذه العملية',
        })

      await ctx.db.deleteFrom('Question').where('id', 'in', input).execute()
      return true
    }),
})
