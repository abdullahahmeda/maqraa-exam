import Head from 'next/head'
import { api } from '../../utils/api'
import { useForm } from 'react-hook-form'
import Badge from '../../components/badge'
import { enStyleToAr } from '../../utils/questions'
import { QuestionStyle, QuestionType } from '../../constants'
import { useRouter } from 'next/router'
import Spinner from '../../components/spinner'
import Button from '../../components/button'
import { toast } from 'react-hot-toast'

type FieldValues = Record<string, string>

const ExamPage = () => {
  const router = useRouter()
  const {
    data: exam,
    isLoadingError,
    isLoading,
    isPaused,
    error: examError
  } = api.exams.getToSolve.useQuery(
    {
      id: router.query.id as string
    },
    {
      enabled: typeof router.query.id === 'string',
      trpc: {
        ssr: false
      },
      refetchOnReconnect: false
    }
  )

  const { register, handleSubmit } = useForm<FieldValues>()

  const examSubmit = api.exams.submit.useMutation()

  const onSubmit = (data: FieldValues) => {
    // maybe confirm modal?
    examSubmit
      .mutateAsync({
        id: exam!.id,
        // id: 'clet8uawe000g356lbmte45my',
        answers: data
      })
      .then(() => {
        router.replace('/exams/submitted')
      })
      .catch(error => {
        if (error.message) toast.error(error.message)
        else toast.error('حدث خطأ غير متوقع')
      })
  }

  return (
    <>
      <style global jsx>{`
        body {
          background: linear-gradient(
              to bottom,
              rgba(92, 77, 66, 0.9) 0%,
              rgba(92, 77, 66, 0.9) 100%
            ),
            url(/bg.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-size: cover;
          height: 100vh;
          background-attachment: fixed;
        }
      `}</style>
      <Head>
        <title>اختبار</title>
      </Head>
      <div className='container mx-auto py-4'>
        {(isLoading || isPaused) && (
          <div className='flex items-center gap-2'>
            <Spinner />
            جاري التحميل
          </div>
        )}
        {isLoadingError && (
          <p className='text-red-600'>
            {examError.message || 'حدث خطأ غير متوفع'}
          </p>
        )}
        {exam && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='bg-white p-5 shadow'
          >
            {exam?.questions.map(({ question, id }, i) => (
              <div key={id} className='mb-4'>
                <p className='block'>
                  {i + 1}. <Badge text={enStyleToAr(question.style)} />{' '}
                  {question.text}
                </p>
                <div className='mt-2'>
                  {question.type === QuestionType.WRITTEN ? (
                    <>
                      <label htmlFor={`question-${id}-answer`}>الإجابة</label>
                      <textarea
                        className='block w-full'
                        id={`question-${id}-answer`}
                        {...register('' + id)}
                      />
                    </>
                  ) : (
                    <>
                      <h3>اختر الإجابة</h3>
                      <div className='flex flex-col'>
                        {question.style === QuestionStyle.CHOOSE ? (
                          <>
                            {question.option1 && (
                              <div className='flex gap-2'>
                                <input
                                  type='radio'
                                  id={`quesion-${id}-option-1`}
                                  {...register('' + id)}
                                  value={question.option1}
                                />
                                <label htmlFor={`quesion-${id}-option-1`}>
                                  {question.option1}
                                </label>
                              </div>
                            )}
                            {question.option2 && (
                              <div className='flex gap-2'>
                                <input
                                  type='radio'
                                  id={`quesion-${id}-option-2`}
                                  {...register('' + id)}
                                  value={question.option2}
                                />
                                <label htmlFor={`quesion-${id}-option-2`}>
                                  {question.option2}
                                </label>
                              </div>
                            )}
                            {question.option3 && (
                              <div className='flex gap-2'>
                                <input
                                  type='radio'
                                  id={`quesion-${id}-option-3`}
                                  {...register('' + id)}
                                  value={question.option3}
                                />
                                <label htmlFor={`quesion-${id}-option-3`}>
                                  {question.option3}
                                </label>
                              </div>
                            )}
                            {question.option4 && (
                              <div className='flex gap-2'>
                                <input
                                  type='radio'
                                  id={`quesion-${id}-option-4`}
                                  {...register('' + id)}
                                  value={question.option4}
                                />
                                <label htmlFor={`quesion-${id}-option-4`}>
                                  {question.option4}
                                </label>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className='flex gap-2'>
                              <input
                                type='radio'
                                id={`quesion-${i + 1}-option-true`}
                                {...register('' + id)}
                                value={question.trueText!}
                              />
                              <label htmlFor={`quesion-${i + 1}-option-true`}>
                                {question.trueText}
                              </label>
                            </div>
                            <div className='flex gap-2'>
                              <input
                                type='radio'
                                id={`quesion-${i + 1}-option-false`}
                                {...register('' + id)}
                                value={question.falseText!}
                              />
                              <label htmlFor={`quesion-${i + 1}-option-false`}>
                                {question.falseText}
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            <Button loading={examSubmit.isLoading} variant='website'>
              تسليم
            </Button>
          </form>
        )}
      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async context => {
//   if (!context.params?.id)
//     return {
//       notFound: true
//     }
//   const id = context.params.id as string

//   const exam = await getExam(id)

//   if (!exam)
//     return {
//       notFound: true
//     }

//   console.log(exam)

//   return {
//     props: {
//       exam: JSON.stringify(exam)
//     }
//   }
// }

export default ExamPage
