import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
import DashboardLayout from '../../../components/dashboard-layout'
import Spinner from '../../../components/spinner'
import { QuestionType } from '../../../constants'
import { api } from '../../../utils/api'
import { enStyleToAr, enTypeToAr } from '../../../utils/questions'

type FieldValues = Record<string, boolean>

const ExamPage = () => {
  const { handleSubmit, reset, register } = useForm({})
  const router = useRouter()

  const {
    data: exam,
    isLoadingError,
    isLoading: _isLoading,
    isPaused,
    error,
    refetch
  } = api.exams.get.useQuery(
    {
      id: router.query.id as string
    },
    {
      enabled: router.isReady,
      trpc: {
        ssr: false
      }
    }
  )

  const examSave = api.exams.save.useMutation()

  useEffect(() => {
    if (exam) {
      const fieldValues = exam.questions.reduce(
        (obj, question) => ({
          ...obj,
          [question.id]: question.isCorrect
        }),
        {}
      )
      reset(fieldValues)
    }
  }, [reset, exam])

  const isLoading = _isLoading || isPaused

  const onSubmit = (data: FieldValues) => {
    examSave
      .mutateAsync({
        id: exam?.id as string,
        questions: data
      })
      .then(() => {
        toast.success('تم حفظ الاختبار بنجاح')
        router.push('/dashboard/exams')
      })
      .catch(error => {
        if (error.message) toast.error(error.message)
        else toast.error('حدث خطأ غير متوقع')
      })
  }

  const correctAnswers = exam?.questions.filter(({ isCorrect }) => isCorrect)

  return (
    <>
      <Head>
        <title>تصحيح اختبار</title>
      </Head>
      <div className='mb-3 rounded bg-gray-100 p-3'>
        {isLoading ? (
          <span className='flex items-center justify-center gap-2 text-center'>
            <Spinner variant='primary' />
            جاري التحميل..
          </span>
        ) : isLoadingError ? (
          <div className='flex flex-col items-center justify-center gap-2 text-center'>
            <p className='text-red-500'>
              حدث خطأ أثناء تحميل البيانات، يرجى إعادة المحاولة
            </p>
            <Button onClick={() => refetch()} variant='primary'>
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex items-center'>
              <h3 className='mb-4 text-center text-2xl font-semibold'>
                الاختبار
              </h3>
              <Badge
                className='relative bottom-2 mr-auto'
                text={
                  exam?.grade === null
                    ? 'لم يتم التصحيح'
                    : `${correctAnswers?.length} من ${exam?.questions.length}`
                }
                variant={exam?.grade !== null ? 'primary' : 'warning'}
              />
            </div>
            {exam?.questions.map(({ id, question, isCorrect, answer }) => (
              <div
                key={id}
                className={clsx('mb-2 rounded p-3', {
                  'bg-green-200': isCorrect,
                  'bg-red-200':
                    !isCorrect &&
                    (exam.grade !== null || question.type === QuestionType.MCQ),
                  'bg-gray-300':
                    !isCorrect &&
                    exam.grade === null &&
                    question.type === QuestionType.WRITTEN
                })}
              >
                <p>
                  <Badge text={enTypeToAr(question.type)} className='ml-1' />
                  <Badge text={enStyleToAr(question.style)} className='ml-2' />
                  {question.text}
                </p>
                <p
                  className={clsx(
                    answer === question.answer && 'text-green-600',
                    question.type === QuestionType.MCQ &&
                      answer !== question.answer &&
                      'text-red-500'
                  )}
                >
                  إجابة الطالب: {answer || '(لا يوجد إجابة)'}
                </p>

                <p>الإجابة الصحيحة: {question.answer}</p>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id={`is-correct-${id}`}
                    {...register('' + id)}
                  />
                  <label htmlFor={`is-correct-${id}`}>تعيين كإجابة صحيحة</label>
                </div>
              </div>
            ))}
            <Button variant='success' className='mt-2' type='submit'>
              حفظ
            </Button>
          </form>
        )}
      </div>
    </>
  )
}

ExamPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default ExamPage
