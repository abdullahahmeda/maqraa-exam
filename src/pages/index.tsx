import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionDifficulty } from '../constants'
import Head from 'next/head'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
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
import { Checkbox } from '~/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Curriculum, Part, QuestionStyle, QuestionType } from '@prisma/client'
import { Input } from '~/components/ui/input'
import { difficultyMapping, styleMapping, typeMapping } from '~/utils/questions'

type Group = {
  number: number
  degreePerQuestion: number
  difficulty: QuestionDifficulty | string
  type: QuestionType | string
  style: QuestionStyle | string
}

type FieldValues = {
  courseId: string
  trackId: string
  curriculumId: string
  distinct: CheckedState
  groups: Group[]
}

const HomePage = () => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newExamSchema),
    defaultValues: {
      groups: [
        {
          number: 25,
          degreePerQuestion: 4,
          difficulty: '',
          type: '',
          style: '',
        },
      ],
    },
  })

  const examCreate = api.exams.create.useMutation()

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const trackId = useWatch({ control: form.control, name: 'trackId' })
  const curriculumId = useWatch({ control: form.control, name: 'curriculumId' })

  const { fields: groups } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.findMany.useQuery()

  const {
    data: tracks,
    isLoading: isTracksLoading,
    fetchStatus: tracksFetchStatus,
  } = api.tracks.findMany.useQuery(
    { where: { courseId } },
    { enabled: !!courseId }
  )

  const {
    isLoading: isCurriculaLoading,
    data: curricula,
    fetchStatus: curriculaFetchStatus,
  } = api.curricula.findMany.useQuery<any, (Curriculum & { parts: Part[] })[]>(
    { where: { trackId: trackId }, include: { parts: true } },
    {
      enabled: !!trackId,
      queryKey: [
        'curricula.findMany',
        {
          where: { track: { id: trackId, courseId } },
          include: { parts: true },
        },
      ],
    }
  )

  const selectedCurriculum = curricula?.filter(
    (c) => c.id === curriculumId
  )?.[0]

  const { data: questionsCount, isLoading } = api.questions.count.useQuery({
    where: {
      OR: selectedCurriculum?.parts.map((part) => ({
        partNumber: part.number,
        hadithNumber: { gte: part.from, lte: part.to },
      })),
    },
  })

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
      <div className='container mx-auto py-10'>
        <div className='mx-auto max-w-[360px] rounded-md bg-white p-4 shadow'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='courseId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المقرر</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                name='distinct'
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
              <div>
                <h3>تقسيمة الأسئلة</h3>
                {groups.map(({ id }, index) => (
                  <div key={id} className='space-y-4'>
                    <div className='flex gap-2'>
                      <FormField
                        control={form.control}
                        name={`groups.${index}.number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عدد الأسئلة</FormLabel>
                            <FormControl>
                              <Input type='number' min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`groups.${index}.degreePerQuestion`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عدد الأسئلة</FormLabel>
                            <FormControl>
                              <Input type='number' min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`groups.${index}.difficulty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المستوى</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger loading={isCoursesLoading}>
                                <SelectValue placeholder='اختر المستوى' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=''>عشوائي</SelectItem>
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
                      name={`groups.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الأسئلة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger loading={isCoursesLoading}>
                                <SelectValue placeholder='اختر نوع الأسئلة' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=''>عشوائي</SelectItem>
                              {Object.entries(typeMapping).map(
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
                      name={`groups.${index}.style`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الأسئلة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger loading={isCoursesLoading}>
                                <SelectValue placeholder='اختر طريقة الأسئلة' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=''>عشوائي</SelectItem>
                              {Object.entries(styleMapping).map(
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
                  </div>
                ))}
              </div>
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
  return { props: { session } }
}

export default HomePage
