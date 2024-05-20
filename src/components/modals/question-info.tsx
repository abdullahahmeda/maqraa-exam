import { Loader2 } from 'lucide-react'
import { api } from '~/trpc/react'
import { enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import { DialogHeader } from '../ui/dialog'

export const QuestionInfoModal = ({ id }: { id: string }) => {
  const {
    data: question,
    isLoading,
    error,
  } = api.question.get.useQuery({
    id,
    include: {
      course: true,
      style: true,
    },
  })

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        نبذة عن السؤال
      </DialogHeader>
      <div>
        <p>رقم السؤال: {question?.number}</p>
        <p>رقم الجزء: {question?.partNumber}</p>
        <p>رقم الصفحة: {question?.pageNumber}</p>
        <p>رقم الحديث: {question?.hadithNumber}</p>
        <p>نص السؤال: {question?.text}</p>
        <p>اسم المقرر: {question?.courseName}</p>
        <p>نوع السؤال: {enTypeToAr(question?.type as string)}</p>
        <p>أسلوب السؤال: {question?.styleName}</p>
        <p>المستوى: {enDifficultyToAr(question?.difficulty as string)}</p>
        <p>الإجابة: {question?.answer}</p>
        <p>إجابة أخرى: {question?.anotherAnswer}</p>
        <p>داخل المظلل: {question?.isInsideShaded ? 'نعم' : 'لا'}</p>
        <p>يستهدف السؤال: {question?.objective}</p>
      </div>
    </>
  )
}
