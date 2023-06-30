import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionDifficulty } from '../constants'
import Head from 'next/head'
import { useForm, useWatch } from 'react-hook-form'
import { api } from '../utils/api'
import { newExamSchema } from '../validation/newExamSchema'
import { useRouter } from 'next/router'
import WebsiteLayout from '../components/layout'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '../server/auth'
import { getBaseUrl } from '../utils/api'
import { useToast } from '~/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'

type FieldValues = {
  difficulty: QuestionDifficulty
  course: string
  curriculum: string
}

const HomePage = () => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newExamSchema),
  })

  const examCreate = api.exams.create.useMutation()

  const { data: courses } = api.courses.findMany.useQuery()

  const selectedCourse = useWatch({
    control: form.control,
    name: 'course',
  })

  console.log(selectedCourse)

  const {
    isFetching: isFetchingCurricula,
    data: curricula,
    refetch: refetchCurricula,
  } = api.curricula.fetchAll.useQuery(
    {
      filters: {
        course: selectedCourse,
      },
    },
    {
      enabled: !!selectedCourse,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    examCreate
      .mutateAsync(data)
      .then((exam) => {
        router.push(`/exams/${exam.id}`)
      })
      .catch((error) => {
        if (error.message) {
          toast({
            title: 'حدث خطأ',
            description: error.message,
          })
        } else
          toast({
            title: 'حدث خطأ غير متوقع',
          })
      })
  }

  return (
    <>
      <Head>
        <title>بدأ اختبار</title>
      </Head>
      <div className='container mx-auto pt-40'>
        <div className='mx-auto max-w-[360px] bg-white p-3 shadow'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='difficulty'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>المستوى</FormLabel>
                    <FormControl>
                      <RadioGroup
                        // @ts-ignore
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-col space-y-1'
                      >
                        <FormItem className='flex items-center gap-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value={QuestionDifficulty.EASY} />
                          </FormControl>
                          <FormLabel className='font-normal'>سهل</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center gap-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value={QuestionDifficulty.MEDIUM} />
                          </FormControl>
                          <FormLabel className='font-normal'>متوسط</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center gap-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value={QuestionDifficulty.HARD} />
                          </FormControl>
                          <FormLabel className='font-normal'>صعب</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='course'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المقرر</FormLabel>
                    <Select
                      disabled={!courses || courses.length === 0}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                name='course'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنهج</FormLabel>
                    <Select
                      disabled={!curricula || curricula.length === 0}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
              <Button type='submit'>بدأ الاختبار</Button>
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

  // if (!session)
  //   return {
  //     redirect: {
  //       destination: `/login?callbackUrl=${getBaseUrl()}`,
  //       permanent: false,
  //     },
  //   }
  return {
    props: {
      session,
    },
  }
}

export default HomePage
