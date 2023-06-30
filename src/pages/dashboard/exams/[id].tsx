import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { compareTwoStrings } from 'string-similarity'
import { Button } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import Spinner from '~/components/spinner'
import { QuestionType } from '~/constants'
import { api } from '~/utils/api'
import { percentage } from '~/utils/percentage'
import { enStyleToAr, enTypeToAr } from '~/utils/questions'
import { isCorrectAnswer, normalizeText } from '~/utils/strings'
import { Badge } from '~/components/ui/badge'

type FieldValues = Record<string, boolean>

const ExamPage = () => {
  const { handleSubmit, reset, register } = useForm<FieldValues>()
  const router = useRouter()

  const {
    data: exam,
    isLoadingError,
    isLoading: _isLoading,
    isPaused,
    error,
    refetch,
  } = api.exams.get.useQuery(
    {
      id: router.query.id as string,
    },
    {
      enabled: router.isReady,
    }
  )

  const examSave = api.exams.save.useMutation()
  const gradeEmailSend = api.emails.sendGradeEmail.useMutation()

  useEffect(() => {
    if (exam) {
      const fieldValues = exam.questions.reduce(
        (obj, question) => ({
          ...obj,
          [question.id]: question.isCorrect,
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
        questions: data,
      })
      .then((isEmailSent) => {
        if (isEmailSent) {
          toast.success('تم حفظ الاختبار وارسال الدرجة بنجاح')
          router.push('/dashboard/exams')
        } else
          toast(
            (t) => (
              <div className='flex flex-col items-center justify-between gap-3'>
                <p>
                  تم حفظ الدرجة لكن حدث خطأ أثناء ارسال الايميل، هل تريد إعادة
                  المحاولة؟
                </p>
                <div className='flex gap-2'>
                  <Button
                    variant='success'
                    onClick={() => {
                      toast.dismiss(t.id)
                      const newToast = toast.loading('جاري ارسال الإيميل')
                      gradeEmailSend
                        .mutateAsync({
                          id: exam!.id,
                        })
                        .then(() => {
                          toast.dismiss(newToast)
                          toast.success('تم ارسال الإيميل بنجاح!')
                        })
                        .catch(() => {
                          toast.dismiss(newToast)
                          toast.error(
                            'فشل ارسال الإيميل، ربما تم تخطي الحد المسموح به من الرسائل. الرجاء المحاولة لاحقاً'
                          )
                        })
                        .finally(() => router.push('/dashboard/exams'))
                    }}
                  >
                    نعم
                  </Button>
                  <Button
                    onClick={() => {
                      toast.dismiss(t.id)
                      router.push('/dashboard/exams')
                    }}
                  >
                    لا
                  </Button>
                </div>
              </div>
            ),
            {
              duration: Infinity,
            }
          )
      })
      .catch((error) => {
        if (error.message) toast.error(error.message)
        else toast.error('حدث خطأ غير متوقع')
      })
  }

  const correctAnswers = exam?.questions.filter(({ isCorrect }) => isCorrect)

  let possibleGrade: null | number = null
  if (exam && exam.grade === null)
    possibleGrade = exam.questions.reduce((acc, { answer, question }) => {
      return acc + Number(isCorrectAnswer(question, answer))
    }, 0)

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
            <Button onClick={() => refetch()}>إعادة المحاولة</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className='mb-4 inline-block text-center text-2xl font-semibold'>
              الإختبار
            </h3>
            <Badge
              className='sticky top-3 float-left mr-auto mt-1 shadow'
              // variant={exam?.grade !== null ? 'primary' : 'warning'}
            >
              {exam?.grade === null
                ? `لم يتم التصحيح - ${possibleGrade} من ${
                    exam?.questions.length
                  } (${percentage(possibleGrade!, exam?.questions.length)}%)`
                : `${correctAnswers?.length} من ${
                    exam?.questions.length
                  } (${percentage(
                    correctAnswers!.length,
                    exam!.questions.length
                  )}%)`}
            </Badge>
            <div className='mb-4'>
              <p>اسم الطالب: {exam?.user.name}</p>
              <p>الإيميل: {exam?.user.email}</p>
            </div>
            <div>
              <h4 className='mb-1 text-xl font-semibold'>الأسئلة</h4>
              {exam?.questions.map(({ id, question, isCorrect, answer }) => (
                <div
                  key={id}
                  className={clsx('mb-2 rounded p-3', {
                    'bg-green-200': isCorrect,
                    'bg-red-200':
                      !isCorrect &&
                      (exam.grade !== null ||
                        question.type === QuestionType.MCQ),
                    'bg-gray-300':
                      !isCorrect &&
                      exam.grade === null &&
                      question.type === QuestionType.WRITTEN,
                  })}
                >
                  <p>
                    <Badge className='ml-1'>{enTypeToAr(question.type)}</Badge>
                    <Badge className='ml-2'>
                      {enStyleToAr(question.style)}
                    </Badge>
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
                  {question.type === QuestionType.WRITTEN && (
                    <p>
                      نسبة التطابق مع الإجابة الصحيحة:{' '}
                      {(
                        compareTwoStrings(
                          normalizeText(question.answer),
                          normalizeText('' + answer)
                        ) * 100
                      ).toFixed(2)}
                      %
                    </p>
                  )}
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id={`is-correct-${id}`}
                      {...register('' + id)}
                    />
                    <label htmlFor={`is-correct-${id}`}>
                      تعيين كإجابة صحيحة
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant='success'
              className='mt-2'
              type='submit'
              loading={examSave.isLoading}
            >
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
