import { compareTwoStrings } from 'string-similarity'
import { QuestionType } from '~/constants'

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

export const isCorrectAnswer = (
  question: { type: string; answer: string },
  answer: string | null
) => {
  return question.type === QuestionType.MCQ
    ? question.answer === answer
    : compareTwoStrings(
        normalizeText('' + answer),
        normalizeText(question.answer)
      ) >= 0.85
}
