import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionDifficulty } from '../constants'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from '../components/button'
import FieldErrorMessage from '../components/field-error-message'
import { api } from '../utils/api'
import { newExamSchema } from '../validation/newExamSchema'
import { useRouter } from 'next/router'

type FieldValues = {
  difficulty: QuestionDifficulty
}

const HomePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldsErrors }
  } = useForm<FieldValues>({
    resolver: zodResolver(newExamSchema)
  })

  const examCreate = api.exams.create.useMutation()

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
          <label>مستوى الاختبار</label>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2 flex gap-4'>
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
            <Button
              variant='primary'
              type='submit'
              loading={examCreate.isLoading}
            >
              بدأ الاختبار
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default HomePage
