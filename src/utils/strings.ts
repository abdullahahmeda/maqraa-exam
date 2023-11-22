import { compareTwoStrings } from 'string-similarity'
import { QuestionType } from '~/kysely/enums'

export const normalizeText = function (text: string) {
  //remove special characters
  text = text.replace(
    /([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g,
    ''
  )

  //normalize Arabic
  text = text.replace(/(آ|إ|أ)/g, 'ا')
  // text = text.replace(/(ة)/g, 'ه');
  text = text.replace(/(ئ|ؤ)/g, 'ء')
  text = text.replace(/(ى)/g, 'ي')
  text = text.replace(/(ى)/g, 'ي')

  //convert arabic numerals to english counterparts.
  const arabicZero = 0x660 // ٠ (Arabic Zero)
  for (var i = 0; i < 10; i++) {
    text.replace(
      String.fromCharCode(arabicZero + i),
      String.fromCharCode(48 + i)
    )
  }

  return text
}

export const correctQuestion = (
  question: { type: QuestionType; answer: string; weight: number },
  answer: string | null
) => {
  if (answer === null) return 0
  if (question.type === 'MCQ')
    return question.answer === answer ? question.weight : 0
  const similarity = compareTwoStrings(
    normalizeText('' + answer),
    normalizeText(question.answer)
  )
  if (similarity < 0.85) return 0
  if (similarity >= 0.85 && similarity < 0.9)
    return Math.ceil(0.75 * question.weight)
  else if (similarity >= 0.9 && similarity < 0.95)
    return Math.ceil(0.85 * question.weight)
  return question.weight
}

export function formatNumber(
  n: number,
  obj: {
    zero: string
    one: string
    two: string
    few: string
    many: string
    other: string
  }
) {
  const arCardinalRules = new Intl.PluralRules('ar-EG')
  const type = arCardinalRules.select(n)
  const word = obj[type]
  if (type === 'zero' || type === 'one' || type === 'two') return word
  return `${n} ${word}`
}
