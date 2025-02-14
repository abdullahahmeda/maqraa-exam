import {
  sql,
  type Selectable,
  type AnyColumn,
  type ExpressionBuilder,
  type SqlBool,
  type Expression,
} from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import type { CurriculumPart, DB } from '~/kysely/types'
import { db } from '~/server/db'
import { applyPagination } from '~/utils/db'
import {
  type IncludeSchema,
  type FiltersSchema,
} from '~/validation/backend/queries/question/common'
import { InfiniteListQuestionSchema } from '~/validation/backend/queries/question/infinite-list'
import { ListQuestionSchema } from '~/validation/backend/queries/question/list'
import { CreateQuestionSchema } from '~/validation/backend/mutations/question/create'
import { type ListRandomQuestionsSchema } from '~/validation/backend/queries/question/list-random'
import { loadGoogleSheet } from './sheet'
import { importedQuestionSchema } from '~/validation/importedQuestionSchema'
import { type QuestionType } from '~/kysely/enums'

export async function applyQuestionsFilters(
  filters: FiltersSchema | undefined,
) {
  let curriculumParts: Selectable<CurriculumPart>[] = []
  if (filters?.curriculum !== undefined)
    curriculumParts = await db
      .selectFrom('CurriculumPart')
      .selectAll()
      .where('curriculumId', '=', filters.curriculum.id)
      .execute()
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    const where: Expression<SqlBool>[] = []
    if (filters?.id !== undefined) where.push(eb('id', '=', filters.id))
    if (filters?.text !== undefined)
      where.push(eb('text', 'like', '%' + filters.text + '%'))
    if (filters?.isInsideShaded !== undefined)
      where.push(eb('isInsideShaded', '=', filters.isInsideShaded))
    if (filters?.courseId !== undefined)
      where.push(eb('courseId', '=', filters.courseId))
    if (filters?.styleId !== undefined)
      where.push(eb('styleId', '=', filters.styleId))
    if (filters?.type !== undefined) where.push(eb('type', '=', filters.type))
    if (filters?.difficulty !== undefined)
      where.push(eb('difficulty', '=', filters.difficulty))
    if (filters?.number !== undefined)
      where.push(eb('number', '=', filters.number))
    if (filters?.pageNumber !== undefined) {
      if (typeof filters.pageNumber === 'number')
        where.push(eb('pageNumber', '=', filters.pageNumber))
      else {
        if (filters.pageNumber.from)
          where.push(eb('pageNumber', '>=', filters.pageNumber.from))
        if (filters.pageNumber.to)
          where.push(eb('pageNumber', '<=', filters.pageNumber.to))
      }
    }
    if (filters?.hadithNumber !== undefined) {
      if (typeof filters.hadithNumber === 'number')
        where.push(eb('hadithNumber', '=', filters.hadithNumber))
      else {
        if (filters.hadithNumber.from)
          where.push(eb('hadithNumber', '>=', filters.hadithNumber.from))
        if (filters.hadithNumber.to)
          where.push(eb('hadithNumber', '<=', filters.hadithNumber.to))
      }
    }

    if (filters?.curriculum !== undefined) {
      if (curriculumParts.length === 0) {
        // empty results
        where.push(sql`1 != 1`)
      } else {
        where.push(
          eb.or(
            curriculumParts.map((part) => {
              let from = part.from
              let to = part.to
              if (filters.curriculum!.type === 'FIRST_MEHWARY') to = part.mid
              else if (filters.curriculum!.type === 'SECOND_MEHWARY')
                from = part.mid
              return eb.and([
                eb('partNumber', '=', part.number),
                eb('hadithNumber', '>=', from),
                eb('hadithNumber', '<=', to),
              ])
            }),
          ),
        )
      }
    }

    if (filters?.partNumber !== undefined) {
      if (typeof filters.partNumber === 'number')
        where.push(eb('partNumber', '=', filters.partNumber))
      else {
        if (filters.partNumber.from)
          where.push(eb('partNumber', '>=', filters.partNumber.from))
        if (filters.partNumber.to)
          where.push(eb('partNumber', '<=', filters.partNumber.to))
      }
    }
    return eb.and(where)
  }
}

export async function getQuestionsTableList(input?: ListQuestionSchema) {
  const where = await applyQuestionsFilters(input?.filters)

  const count = Number(
    (
      await db
        .selectFrom('Question')
        .select(({ fn }) => fn.count<string>('id').as('count'))
        .where(where)
        .executeTakeFirstOrThrow()
    ).count,
  )

  const query = applyPagination(
    db
      .selectFrom('Question')
      .selectAll()
      .select(applyQuestionsInclude(input?.include))
      .where(where),
    input?.pagination,
  )

  const rows = await query.execute()

  return {
    data: rows,
    count,
  }
}

export async function getInfiniteQuestionsList(
  input?: InfiniteListQuestionSchema,
) {
  const limit = 100 // default limit
  const where = await applyQuestionsFilters(input?.filters)
  let query = db
    .selectFrom('Question')
    .selectAll()
    .select(applyQuestionsInclude(input?.include))
    .where(where)
    .limit(limit + 1)
  if (input?.cursor) query = query.where('id', '>', input.cursor)
  const questions = await query.execute()

  let nextCursor: string | undefined = undefined
  if (questions.length > limit) {
    const nextItem = questions.pop() as { id: string }
    nextCursor = nextItem.id
  }

  return {
    data: questions,
    nextCursor,
  }
}

export async function getQuestionShow(id: string) {
  const question = await db
    .selectFrom('Question')
    .innerJoin('QuestionStyle', 'Question.styleId', 'QuestionStyle.id')
    .selectAll('Question')
    .select([
      'QuestionStyle.name as questionStyleName',
      'QuestionStyle.type as questionStyleType',
      'QuestionStyle.choicesColumns as questionStyleChoicesColumns',
    ])
    .where('Question.id', '=', id)
    .executeTakeFirst()
  return question
}

export async function getShowQuestion(id: string) {
  const query = db
    .selectFrom('Question')
    .selectAll('Question')
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('Course')
          .selectAll('Course')
          .whereRef('Question.courseId', '=', 'Course.id'),
      ).as('course'),
      jsonObjectFrom(
        eb
          .selectFrom('QuestionStyle')
          .selectAll('QuestionStyle')
          .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
      ).as('style'),
    ])
    .where('Question.id', '=', id)

  return query.executeTakeFirst()
}

export async function loadQuestionsGoogleSheet({
  spreadsheetId,
  sheetName,
  courseId,
  questionStyles,
}: {
  spreadsheetId: string
  sheetName: string
  courseId: string
  questionStyles: Record<
    string,
    { id: string; type: QuestionType; columnChoices: string[] }
  >
}) {
  const data = await loadGoogleSheet({
    spreadsheetId,
    sheetName,
    mapper: (row) => ({
      number: row[0],
      pageNumber: row[1],
      partNumber: row[2],
      hadithNumber: row[3],
      type: row[4],
      styleName: row[5],
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
      questionStyles,
    }),
    validationSchema: importedQuestionSchema.transform((d) => ({
      ...d,
      questionStyles: undefined,
      styleName: undefined,
      styleId: questionStyles[d.styleName]!.id,
    })),
  })
  return data
}

export async function importQuestions(data: CreateQuestionSchema[]) {
  const columns: AnyColumn<DB, 'Question'>[] = [
    'number',
    'pageNumber',
    'partNumber',
    'hadithNumber',
    'type',
    'styleId',
    'difficulty',
    'text',
    'textForTrue',
    'textForFalse',
    'option1',
    'option2',
    'option3',
    'option4',
    'answer',
    'anotherAnswer',
    'isInsideShaded',
    'objective',
    'courseId',
  ]

  const rows = columns.map((col) => data.map((d) => d[col as keyof typeof d]))

  await db
    .insertInto('Question')
    .columns(columns)
    .expression(
      () =>
        sql`select * from unnest(
              ${rows[0]}::integer[], 
              ${rows[1]}::integer[],
              ${rows[2]}::integer[],
              ${rows[3]}::integer[],
              ${rows[4]}::"QuestionType"[],
              ${rows[5]}::text[],
              ${rows[6]}::"QuestionDifficulty"[],
              ${rows[7]}::text[],
              ${rows[8]}::text[],
              ${rows[9]}::text[],
              ${rows[10]}::text[],
              ${rows[11]}::text[],
              ${rows[12]}::text[],
              ${rows[13]}::text[],
              ${rows[14]}::text[],
              ${rows[15]}::text[],
              ${rows[16]}::boolean[],
              ${rows[17]}::text[],
              ${rows[18]}::text[])`,
    )
    .execute()
}

export async function getExportQuestions() {
  const questions = await db
    .selectFrom('Question')
    .selectAll('Question')
    .select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom('QuestionStyle')
          .selectAll('QuestionStyle')
          .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
      ).as('style'),
    )
    .orderBy('number asc')
    .execute()
  return questions
}

export function applyQuestionsInclude(include: IncludeSchema | undefined) {
  return (eb: ExpressionBuilder<DB, 'Question'>) => {
    return [
      ...(include?.course
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('Course')
                .selectAll('Course')
                .whereRef('Question.courseId', '=', 'Course.id'),
            ).as('course'),
          ]
        : []),
      ...(include?.style
        ? [
            jsonObjectFrom(
              eb
                .selectFrom('QuestionStyle')
                .selectAll('QuestionStyle')
                .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
            ).as('style'),
          ]
        : []),
    ]
  }
}

export function deleteQuestions(ids: string | string[] | undefined) {
  let query = db.deleteFrom('Question')
  if (ids !== undefined)
    query = query.where('id', 'in', typeof ids === 'string' ? [ids] : [...ids])
  return query.execute()
}

export async function listRandomQuestions(input: ListRandomQuestionsSchema) {
  const where = await applyQuestionsFilters(input.filters)
  return db
    .selectFrom('Question')
    .selectAll('Question')
    .select(applyQuestionsInclude(input.include))
    .where(where)
    .limit(input.limit)
    .orderBy(sql`RANDOM()`)
    .execute()
}
