import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionDifficulty } from '../constants'
import Head from 'next/head'
import {
  UseFieldArrayRemove,
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { api } from '../utils/api'
import { newExamSchema } from '../validation/newExamSchema'
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
import {
  Curriculum,
  CurriculumPart,
  QuestionStyle,
  QuestionType,
} from '@prisma/client'
import { Input } from '~/components/ui/input'
import { difficultyMapping, styleMapping, typeMapping } from '~/utils/questions'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash } from 'lucide-react'
import { z } from 'zod'

type Group = {
  number: number
  gradePerQuestion: number
  difficulty: QuestionDifficulty | string | undefined
  styleOrType: QuestionStyle | QuestionType | string | undefined
}

type FieldValues = {
  courseId: string
  trackId: string
  curriculumId: string
  repeatFromSameHadith: CheckedState
  groups: Group[]
}

const QuestionGroup = ({
  id,
  index,
  form,
  remove,
}: {
  id: string
  index: number
  form: UseFormReturn<FieldValues>
  remove: UseFieldArrayRemove
}) => {
  const {
    attributes: { role, ...attributes },
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id })

  const style = { transform: CSS.Transform.toString(transform) }

  return (
    <AccordionItem
      value={id}
      ref={setNodeRef}
      {...attributes}
      style={style}
      className='transition-transform last-of-type:border-b-0'
    >
      <AccordionTrigger {...listeners} className='bg-gray-50 p-3'>
        المجموعة {index + 1}
      </AccordionTrigger>
      <AccordionContent className='bg-gray-50/50'>
        <div className='space-y-4 p-3'>
          <div className='flex justify-end'>
            <Button
              size='icon'
              variant='destructive'
              onClick={() => remove(index)}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex gap-2'>
            <FormField
              control={form.control}
              name={`groups.${index}.number`}
              render={({ field }) => (
                <FormItem className='flex-grow'>
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
              name={`groups.${index}.gradePerQuestion`}
              render={({ field }) => (
                <FormItem className='flex-grow'>
                  <FormLabel>الدرجة للسؤال</FormLabel>
                  <FormControl>
                    <Input min={1} {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='اختر المستوى' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=''>عشوائي</SelectItem>
                    {Object.entries(difficultyMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name={`groups.${index}.styleOrType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الأسئلة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='اختر طريقة الأسئلة' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=''>عشوائي</SelectItem>
                    {Object.entries(typeMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {Object.entries(styleMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

const HomePage = () => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newExamSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      groups: [
        {
          number: 25,
          gradePerQuestion: 1,
          difficulty: '',
          styleOrType: '',
        },
      ],
    },
  })

  const examCreate = api.exams.createPublic.useMutation()

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const trackId = useWatch({ control: form.control, name: 'trackId' })

  const {
    fields: groups,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.findMany.useQuery({})

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
  } = api.curricula.findMany.useQuery<
    any,
    (Curriculum & { parts: CurriculumPart[] })[]
  >(
    {
      where: { trackId: trackId },
      include: { parts: true },
    },
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

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    examCreate
      .mutateAsync(data as z.infer<typeof newExamSchema>)
      .then((exam) => {
        if (exam) router.push(`/exams/${exam.id}`)
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

  const appendGroup = () => {
    append({
      number: 25,
      gradePerQuestion: 1,
      difficulty: '',
      styleOrType: '',
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id)
      const newIndex = groups.findIndex((g) => g.id === over.id)
      swap(oldIndex, newIndex)
    }
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
              <div>
                <h3>تقسيمة الأسئلة</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={groups}
                    strategy={verticalListSortingStrategy}
                  >
                    <Accordion
                      type='single'
                      collapsible
                      className='overflow-hidden rounded-md shadow'
                    >
                      {groups.map(({ id }, index) => (
                        <QuestionGroup
                          id={id}
                          index={index}
                          form={form}
                          remove={remove}
                          key={id}
                        />
                      ))}
                    </Accordion>
                  </SortableContext>
                </DndContext>
                <FormField
                  control={form.control}
                  name='groups'
                  render={() => (
                    <FormItem>
                      <FormMessage className='mt-2' />
                    </FormItem>
                  )}
                />
                <Button type='button' className='mt-2' onClick={appendGroup}>
                  إضافة مجموعة أخرى
                </Button>
              </div>
              <Button>بدأ الاختبار</Button>
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
