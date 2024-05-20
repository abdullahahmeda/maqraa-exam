import { type Selectable } from 'kysely'
import invert from 'lodash.invert'
import { Badge } from '~/components/ui/badge'
import type { Course, Question, QuestionStyle } from '~/kysely/types'
import { columnMapping, enDifficultyToAr, enTypeToAr } from '~/utils/questions'

export const ViewOne = ({
  question,
}: {
  question: Selectable<Question> & {
    style: Selectable<QuestionStyle> | null
    course: Selectable<Course> | null
  }
}) => {
  return (
    <>
      <p>رقم الصفحة: {question.pageNumber}</p>
      <p>رقم الجزء: {question.partNumber}</p>
      <p>رقم الحديث: {question.hadithNumber}</p>
      <p>رقم السؤال: {question.number}</p>
      <p>نص السؤال: {question.text}</p>
      <p>نوع السؤال: {enTypeToAr(question.type)}</p>
      <p>أسلوب السؤال: {question.style?.name}</p>
      {question.type === 'MCQ' && (
        <div className='flex items-center'>
          <p>الإختيارات: </p>
          <div className='flex gap-1'>
            {question.style?.choicesColumns.map((column) => (
              <Badge key={column}>{invert(columnMapping)[column]}</Badge>
            ))}
          </div>
        </div>
      )}
      <p>المقرر: {question.course?.name}</p>
      <p>الإجابة الصحيحة: {question.answer}</p>
      <p>إجابة أخرى: {question.anotherAnswer}</p>
      <p>الهدف: {question.objective}</p>
      <p>المستوى: {enDifficultyToAr(question.difficulty)}</p>
      <p>داخل المظلل: {question.isInsideShaded ? 'نعم' : 'لا'}</p>
    </>
  )
}
