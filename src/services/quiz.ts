import { sample } from 'lodash'
import { db } from '~/server/db'

export async function getQuestions(requirements: any) {
  let questionsQuery = db
    .selectFrom('Question')
    .select(['id', 'partNumber', 'pageNumber', 'hadithNumber'])
    .where('courseId', '=', requirements.courseId)
    .where('type', '=', 'MCQ')
    .where(({ or, and, eb, selectFrom }) =>
      eb(
        'id',
        'not in',
        selectFrom('Question')
          .select('id')
          .where('courseId', '=', requirements.courseId)
          .where(
            or([
              or([
                eb('partNumber', '<', requirements.fromPart),
                and([
                  eb('partNumber', '=', requirements.fromPart),
                  eb('pageNumber', '<', requirements.fromPage),
                ]),
                and([
                  eb('partNumber', '=', requirements.fromPart),
                  eb('pageNumber', '=', requirements.fromPage),
                  eb('hadithNumber', '<', requirements.fromHadith),
                ]),
              ]),
              or([
                eb('partNumber', '>', requirements.toPart),
                and([
                  eb('partNumber', '=', requirements.toPart),
                  eb('pageNumber', '>', requirements.toPage),
                ]),
                and([
                  eb('partNumber', '=', requirements.toPart),
                  eb('pageNumber', '=', requirements.toPage),
                  eb('hadithNumber', '>', requirements.toHadith),
                ]),
              ]),
            ])
          )
      )
    )

  if (requirements.difficulty) {
    questionsQuery = questionsQuery.where(
      'difficulty',
      '=',
      requirements.difficulty
    )
  }

  let questionsResults = await questionsQuery.execute()
  let questions = questionsResults
  if (requirements.repeatFromSameHadith === false) {
    const uniqHadiths = new Map()
    for (const q of questionsResults) {
      const key = `${q.partNumber}:${q.pageNumber}:${q.hadithNumber}`
      let val = q
      if (uniqHadiths.has(key)) {
        const oldVal = uniqHadiths.get(key)
        val = sample([oldVal, val])
        uniqHadiths.delete(key)
      }
      uniqHadiths.set(key, val)
    }
    questions = Array.from(uniqHadiths.values())
  }

  return questions
}
