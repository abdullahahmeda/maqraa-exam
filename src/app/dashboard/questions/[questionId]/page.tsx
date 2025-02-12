import { notFound } from 'next/navigation'
import { Badge } from '~/components/ui/badge'
import { getQuestionShow } from '~/services/question'
import { QuestionType } from '~/kysely/enums'
import { RightAnswerIcon } from './_components/right-answer-icon'
import { WrongAnswerIcon } from './_components/wrong-answer-icon'
import { enTypeToAr } from '~/utils/questions'

type Params = { questionId: string }

export default async function QuestionPage({ params }: { params: Params }) {
  const question = await getQuestionShow(params.questionId)

  if (!question) notFound()

  return (
    <div className='bg-white p-4 rounded-lg border'>
      <h4>
        <span className='font-semibold'>س: </span>
        <Badge className='ml-1'>{enTypeToAr(question.questionStyleType)}</Badge>
        <Badge>{question.questionStyleName}</Badge> {question.text}
      </h4>
      <div className='mt-3'>
        {question.questionStyleType === QuestionType.WRITTEN ? (
          <p>
            <span className='font-semibold'>ج:</span> {question.answer}
          </p>
        ) : (
          <>
            <p className='font-semibold'>الإختيارات المتاحة</p>
            <div>
              {question.questionStyleChoicesColumns.map((column) => {
                const label = question[
                  column as keyof typeof question
                ] as string

                return (
                  <div className='flex gap-2 items-center' key={label}>
                    <p>{label}</p>
                    {label === question.answer ? <RightAnswerIcon /> : <WrongAnswerIcon />}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <hr className='my-2' />
      <p>رقم السؤل: {question.number}</p>
    </div>
  )
}
