import { api } from '~/utils/api'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '../ui/select'
import { QuizType, QuestionsGroupType } from '~/kysely/enums'
import { z } from 'zod'
import { Checkbox } from '../ui/checkbox'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Accordion } from '../ui/accordion'
import { Button } from '../ui/button'
import { CheckedState } from '@radix-ui/react-checkbox'
import { QuestionGroup, Group } from '../questions-group'
import { Input } from '../ui/input'
import { useState } from 'react'
import { DatePicker } from '~/components/ui/date-picker'

type FieldValues = {
  name: string
  type: string
  endsAt: Date | null | undefined
  courseId: any
  trackId: string
  curriculumId: string
  repeatFromSameHadith: CheckedState
  groups: Group[]
  cycleId: string
}

export const AddSystemExamDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<FieldValues>({
    resolver: zodResolver(newSystemExamSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      groups: [
        {
          type: QuestionsGroupType.AUTOMATIC,
          questionsNumber: 25,
          gradePerQuestion: 1,
          difficulty: '',
          styleOrType: '',
          // questions: {},
        },
      ],
    },
  })

  const examCreate = api.systemExam.create.useMutation()

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
  } = api.curriculum.list.useQuery({
    filters: { trackId },
    include: { parts: true },
  })

  const {
    fields: groups,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const { data: cycles, isLoading: isCyclesLoading } = api.cycle.list.useQuery(
    {}
  )

  const appendGroup = () => {
    append({
      type: 'AUTOMATIC',
      questionsNumber: 25,
      gradePerQuestion: 1,
      difficulty: '',
      styleOrType: '',
      questions: [],
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

  const onSubmit = (data: FieldValues) => {
    // console.log(data)
    setSubmitting(true)
    examCreate
      .mutateAsync(data as z.infer<typeof newSystemExamSchema>)
      .then(() => {
        toast({ title: 'تم إضافة الإختبار بنجاح لكل الطلاب' })
        setDialogOpen(false)
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
      .finally(() => {
        setSubmitting(false)
        queryClient.invalidateQueries([['systemExam']])
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم مميز للإختبار</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الإختبار</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر نوع الإختبار' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={QuizType.WHOLE_CURRICULUM}>
                    المنهج كامل
                  </SelectItem>
                  <SelectItem value={QuizType.FIRST_MEHWARY}>
                    الإختبار المحوري الأول
                  </SelectItem>
                  <SelectItem value={QuizType.SECOND_MEHWARY}>
                    الإختبار المحوري الثاني
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endsAt'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>تاريخ قفل الإختبار</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={(date: Date) => date < new Date()}
                  mode='single'
                />
              </FormControl>
              <FormDescription>
                اتركه فارعاً إن كان الإختبار مفتوح. قم باختيار نفس التاريخ
                لإزالة الاختيار
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          render={({ field }) => {
            const disabled = !courseId
            return (
              <FormItem>
                <FormLabel>المسار</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
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
                {disabled && (
                  <FormDescription>يجب اختيار المقرر أولاً</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name='curriculumId'
          render={({ field }) => {
            const disabled = !courseId || !trackId
            return (
              <FormItem>
                <FormLabel>المنهج</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
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
                {disabled && (
                  <FormDescription>
                    يجب اختيار المقرر والمسار أولاً
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
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
        <p>أقصى عدد للأسئلة في الإختبار: 25، مجموع الدرجات يجب أن يساوي 100</p>
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
                    // @ts-ignore
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
                <FormMessage className='mt-2'>يوجد خطأ</FormMessage>
              </FormItem>
            )}
          />
          <Button type='button' className='mt-2' onClick={appendGroup}>
            إضافة مجموعة أخرى
          </Button>
        </div>
        <FormField
          control={form.control}
          name='cycleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدورة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger loading={isCyclesLoading}>
                    <SelectValue placeholder='اختر الدورة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={submitting}>إنشاء الإختبار</Button>
      </form>
    </Form>
  )
}
