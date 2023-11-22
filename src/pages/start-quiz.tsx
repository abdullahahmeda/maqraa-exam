import { zodResolver } from '@hookform/resolvers/zod'
import Head from 'next/head'
import {
  UseFieldArrayRemove,
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { api } from '../utils/api'
import { newQuizSchema } from '../validation/newQuizSchema'
import { useRouter } from 'next/router'
import WebsiteLayout from '../components/layout'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '../server/auth'
import { useToast } from '~/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { QuestionType, QuestionDifficulty } from '~/kysely/enums'
import { Input } from '~/components/ui/input'
import { difficultyMapping, typeMapping } from '~/utils/questions'
import { z } from 'zod'
import { useState } from 'react'
import { handleFormError } from '~/utils/errors'

type Group = {}

type FieldValues = {
  courseId: any
  trackId: string
  curriculumId: string
  repeatFromSameHadith: CheckedState
  questionsNumber: number
  gradePerQuestion: number
  difficulty: QuestionDifficulty | string | undefined
  type: QuestionType | string | undefined
}
const HomePage = () => {
  const { toast } = useToast()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FieldValues>({
    resolver: zodResolver(newQuizSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      questionsNumber: 25,
      gradePerQuestion: 1,
      difficulty: '',
      type: '',
    },
  })

  const quizCreate = api.quiz.create.useMutation()

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const trackId = useWatch({ control: form.control, name: 'trackId' })

  const { data: courses, isLoading: isCoursesLoading } =
    api.course.list.useQuery({})

  const {
    data: tracks,
    isLoading: isTracksLoading,
    fetchStatus: tracksFetchStatus,
  } = api.track.list.useQuery(
    { filters: { courseId } },
    { enabled: !!courseId }
  )

  const {
    isLoading: isCurriculaLoading,
    data: curricula,
    fetchStatus: curriculaFetchStatus,
  } = api.curriculum.list.useQuery(
    {
      filters: { trackId },
      include: { parts: true },
    },
    {
      enabled: !!trackId,
    }
  )

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    setSubmitting(true)
    quizCreate
      .mutateAsync(data as z.infer<typeof newQuizSchema>)
      .then((quiz) => {
        if (quiz) router.push(`/quizzes/${quiz.id}`)
      })
      .catch((error) => {
        setSubmitting(false)
        handleFormError(error, {
          fields: (key, message) =>
            form.setError(key as keyof FieldValues, { message }),
          form: (message) => form.setError('root.form', { message }),
          default: (message) => toast({ title: message }),
        })
      })
  }

  return (
    <>
      <Head>
        <title>بدأ اختبار</title>
      </Head>
      <div className='container mx-auto py-10'>
        <div className='mx-auto max-w-md rounded-md bg-white p-4 shadow'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='courseId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المقرر</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger loading={isCoursesLoading}>
                          <SelectValue placeholder='اختر المقرر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='trackId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المسار</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          loading={
                            tracksFetchStatus === 'fetching' && isTracksLoading
                          }
                        >
                          <SelectValue placeholder='اختر المسار' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tracks?.map((track) => (
                          <SelectItem key={track.id} value={track.id}>
                            {track.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='curriculumId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنهج</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          loading={
                            curriculaFetchStatus === 'fetching' &&
                            isCurriculaLoading
                          }
                        >
                          <SelectValue placeholder='اختر المنهج' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {curricula?.map((curriculum) => (
                          <SelectItem key={curriculum.id} value={curriculum.id}>
                            {curriculum.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='repeatFromSameHadith'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 space-x-reverse'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>السماح بأكثر من سؤال في نفس الحديث</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <p>
                أقصى عدد للأسئلة في الإختبار: 25، مجموع الدرجات يجب أن يساوي 100
              </p>
              <div className='grid grid-cols-2 gap-x-2 gap-y-4'>
                <FormField
                  control={form.control}
                  name={`questionsNumber`}
                  render={({ field }) => (
                    <FormItem className='flex-grow'>
                      <FormLabel>عدد الأسئلة</FormLabel>
                      <FormControl>
                        <Input type='number' min={1} max={25} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`gradePerQuestion`}
                  render={({ field }) => (
                    <FormItem className='flex-grow'>
                      <FormLabel>الدرجة للسؤال</FormLabel>
                      <FormControl>
                        <Input min={1} max={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`difficulty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المستوى</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='اختر المستوى' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=''>كل المستويات</SelectItem>
                          {Object.entries(difficultyMapping).map(
                            ([label, value]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>طريقة الأسئلة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='اختر طريقة الأسئلة' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=''>موضوعي و مقالي</SelectItem>
                          {Object.entries(typeMapping).map(([label, value]) => (
                            <SelectItem key={value} value={value}>
                              {label} فقط
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button loading={submitting}>بدأ الاختبار</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

HomePage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context
  const session = await getServerAuthSession({ req, res })

  return { props: { session } }
}

export default HomePage
