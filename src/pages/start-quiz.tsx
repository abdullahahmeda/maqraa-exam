import { zodResolver } from '@hookform/resolvers/zod'
import Head from 'next/head'
import { useForm, useWatch } from 'react-hook-form'
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
import { useEffect, useState } from 'react'
import { handleFormError } from '~/utils/errors'
import { Separator } from '~/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

type FieldValues = {
  courseId: any
  from: {
    part: string
    page: string
    hadith: string
  }
  to: {
    part: string
    page: string
    hadith: string
  }
  repeatFromSameHadith: CheckedState
  questionsNumber: number
  difficulty: QuestionDifficulty | string | undefined
}
const HomePage = () => {
  const { toast } = useToast()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FieldValues>({
    resolver: zodResolver(newQuizSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      questionsNumber: 25,
      difficulty: '',
    },
  })

  const quizCreate = api.quiz.create.useMutation()

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const fromPart = useWatch({ control: form.control, name: 'from.part' })
  const toPart = useWatch({ control: form.control, name: 'to.part' })
  const fromPage = useWatch({ control: form.control, name: 'from.page' })
  const toPage = useWatch({ control: form.control, name: 'to.page' })
  const fromHadith = useWatch({ control: form.control, name: 'from.hadith' })
  const toHadith = useWatch({ control: form.control, name: 'to.hadith' })
  const difficulty = useWatch({ control: form.control, name: 'difficulty' })
  const repeatFromSameHadith = useWatch({
    control: form.control,
    name: 'repeatFromSameHadith',
  })

  const { data: courses, isLoading: isCoursesLoading } =
    api.course.list.useQuery({})

  const {
    data: questionsInfo,
    isLoading: isQuestionsInfoLoading,
    fetchStatus: questionsInfoFetchStatus,
    dataUpdatedAt,
  } = api.quiz.getQuestionsInfo.useQuery(
    {
      courseId,
      fromPart,
      toPart,
      fromPage,
      toPage,
      fromHadith,
      toHadith,
      difficulty: difficulty as QuestionDifficulty | '',
      repeatFromSameHadith: repeatFromSameHadith as boolean | undefined,
    },
    { enabled: !!courseId }
  )

  const fromParts =
    toPart != undefined
      ? questionsInfo?.parts.filter((p) => p <= Number(toPart))
      : questionsInfo?.parts

  const toParts =
    fromPart != undefined
      ? questionsInfo?.parts.filter((p) => p >= Number(fromPart))
      : questionsInfo?.parts

  const fromPages =
    fromPart != undefined && fromPart === toPart && toPage != undefined
      ? questionsInfo?.fromPages?.filter((p) => p <= Number(toPage))
      : questionsInfo?.fromPages

  const toPages =
    fromPart != undefined && fromPart === toPart && fromPage != undefined
      ? questionsInfo?.toPages?.filter((p) => p >= Number(fromPage))
      : questionsInfo?.toPages

  const fromHadiths =
    fromPart != undefined &&
    fromPart === toPart &&
    toPage != undefined &&
    fromPage === toPage &&
    toHadith != undefined
      ? questionsInfo?.fromHadiths?.filter((h) => h <= Number(toHadith))
      : questionsInfo?.fromHadiths

  const toHadiths =
    fromPart != undefined &&
    fromPart === toPart &&
    fromPage != undefined &&
    fromPage === toPage &&
    fromHadith != undefined
      ? questionsInfo?.toHadiths?.filter((h) => h >= Number(fromHadith))
      : questionsInfo?.toHadiths

  useEffect(() => {
    if (
      questionsInfo?.questions !== undefined &&
      form.getValues('questionsNumber')
    ) {
      form.setValue(
        'questionsNumber',
        Math.min(
          Number(form.getValues('questionsNumber')),
          questionsInfo.questions,
          25
        )
      )
    }
  }, [dataUpdatedAt])

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    setSubmitting(true)
    quizCreate
      .mutateAsync(data as any)
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
                    <FormLabel>الكتاب</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={isCoursesLoading}
                        >
                          <SelectValue placeholder='اختر الكتاب' />
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
              <div className='relative'>
                {questionsInfoFetchStatus === 'fetching' &&
                  isQuestionsInfoLoading && (
                    <div className='absolute inset-0 z-50 flex items-center justify-center'>
                      <Loader2
                        className='animate-spin text-zinc-500'
                        size={48}
                      />
                    </div>
                  )}
                <div
                  className={cn(
                    'grid grid-cols-[1fr_1px_1fr] gap-4',
                    questionsInfoFetchStatus === 'fetching' &&
                      isQuestionsInfoLoading &&
                      'opacity-50'
                  )}
                >
                  <div className='space-y-2'>
                    <h3 className='text-lg'>من</h3>
                    <FormField
                      control={form.control}
                      name='from.part'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الجزء أو المجلد</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fromParts?.map((part) => (
                                <SelectItem key={part} value={'' + part}>
                                  {part}
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
                      name='from.page'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الصفحة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fromPages?.map((page) => (
                                <SelectItem key={page} value={'' + page}>
                                  {page}
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
                      name='from.hadith'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الحديث</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fromHadiths?.map((hadith) => (
                                <SelectItem key={hadith} value={'' + hadith}>
                                  {hadith}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator orientation='vertical' />
                  <div className='space-y-2'>
                    <h3 className='text-lg'>إلى</h3>
                    <FormField
                      control={form.control}
                      name='to.part'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الجزء أو المجلد</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toParts?.map((part) => (
                                <SelectItem key={part} value={'' + part}>
                                  {part}
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
                      name='to.page'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الصفحة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toPages?.map((page) => (
                                <SelectItem key={page} value={'' + page}>
                                  {page}
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
                      name='to.hadith'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الحديث</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                              // loading={
                              //   questionsInfoFetchStatus === 'fetching' &&
                              //   isQuestionsInfoLoading
                              // }
                              >
                                <SelectValue placeholder='اختر' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toHadiths?.map((hadith) => (
                                <SelectItem key={hadith} value={'' + hadith}>
                                  {hadith}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
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
              <FormField
                control={form.control}
                name={`difficulty`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المستوى</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name={`questionsNumber`}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormLabel>عدد الأسئلة</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={questionsInfo?.questions}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
