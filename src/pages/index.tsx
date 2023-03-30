import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionDifficulty } from '../constants'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DashboardButton from '../components/dashboard/button'
import FieldErrorMessage from '../components/field-error-message'
import { api } from '../utils/api'
import { newExamSchema } from '../validation/newExamSchema'
import { useRouter } from 'next/router'
import { customErrorMap } from '../validation/customErrorMap'
import Select from '../components/select'

type FieldValues = {
  difficulty: QuestionDifficulty
  course: number
  curriculum: number
}

const HomePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldsErrors },
    watch
  } = useForm<FieldValues>({
    resolver: zodResolver(newExamSchema, {
      errorMap: customErrorMap
    })
  })

  const examCreate = api.exams.create.useMutation()

  const { data: courses } = api.courses.fetchAll.useQuery()

  const selectedCourse = watch('course')

  const {
    isFetching: isFetchingCurricula,
    data: curricula,
    refetch: refetchCurricula
  } = api.curricula.fetchAll.useQuery(
    {
      filters: {
        course: selectedCourse
      }
    },
    {
      enabled: !!selectedCourse,
      refetchOnMount: false,
      refetchOnReconnect: false,
      trpc: {
        ssr: false
      }
    }
  )

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    examCreate
      .mutateAsync(data)
      .then(exam => {
        router.push(`/exams/${exam.id}`)
      })
      .catch(error => {
        if (error.message) {
          toast.error(error.message)
        } else toast.error('حدث خطأ غير متوقع')
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
        }
      `}</style>
      <Head>
        <title>بدأ اختبار</title>
      </Head>
      <div className='container mx-auto pt-40'>
        <div className='mx-auto max-w-[360px] bg-white p-3 shadow'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <label>مستوى الاختبار</label>
              <div className='flex gap-4'>
                <div className='flex items-center gap-2'>
                  <input
                    type='radio'
                    {...register('difficulty')}
                    id='easy'
                    value={QuestionDifficulty.EASY}
                  />
                  <label htmlFor='easy'>سهل</label>
                </div>
                <div className='flex items-center gap-2'>
                  <input
                    type='radio'
                    {...register('difficulty')}
                    id='medium'
                    value={QuestionDifficulty.MEDIUM}
                  />
                  <label htmlFor='medium'>متوسط</label>
                </div>
                <div className='flex items-center gap-2'>
                  <input
                    type='radio'
                    {...register('difficulty')}
                    id='hard'
                    value={QuestionDifficulty.HARD}
                  />
                  <label htmlFor='hard'>صعب</label>
                </div>
                <FieldErrorMessage>
                  {fieldsErrors.difficulty?.message}
                </FieldErrorMessage>
              </div>
            </div>
            <div className='mb-2'>
              <label htmlFor='course'>المقرر</label>
              <Select
                disabled={!courses || courses.length === 0}
                className='w-full'
                id='course'
                {...register('course', {
                  valueAsNumber: true
                })}
              >
                {!!courses && courses?.length > 0 ? (
                  <>
                    <option value={undefined}>اختر المقرر</option>
                    {courses?.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>لا يوجد خيارات</option>
                )}
              </Select>
              <FieldErrorMessage>
                {fieldsErrors.course?.message}
              </FieldErrorMessage>
            </div>
            <div className='mb-2'>
              <label htmlFor='sheet'>المنهج</label>
              <Select
                disabled={!curricula || curricula.length === 0}
                className='w-full'
                id='sheet'
                {...register('curriculum', {
                  valueAsNumber: true
                })}
              >
                {!!curricula && curricula?.length > 0 ? (
                  <>
                    <option value=''>اختر المنهج</option>
                    {curricula.map(curriculum => (
                      <option key={curriculum.id} value={curriculum.id}>
                        {curriculum.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>لا يوجد خيارات</option>
                )}
              </Select>
              <FieldErrorMessage>
                {fieldsErrors.curriculum?.message}
              </FieldErrorMessage>
            </div>
            <DashboardButton
              variant='primary'
              type='submit'
              loading={examCreate.isLoading}
            >
              بدأ الاختبار
            </DashboardButton>
          </form>
        </div>
      </div>
    </>
  )
}

export default HomePage
