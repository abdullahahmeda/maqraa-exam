import { api } from '~/utils/api'
import { FieldPath, useFieldArray, useForm, useWatch } from 'react-hook-form'
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
import { toast } from 'sonner'
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
import { useEffect, useState } from 'react'
import { DatePicker } from '~/components/ui/date-picker'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { CourseTrackCurriculumFormFields } from '../course-track-curriculum-form-fields'
import { Question } from '~/kysely/types'
import { Selectable } from 'kysely'
import { inferRouterInputs } from '@trpc/server'
import { AppRouter } from '~/server/api/root'
import { QuestionCard } from '../ui/question-card'

type FieldValues = {
  name: string
  type: QuizType
  isInsideShaded: string
  endsAt: Date | null | undefined
  courseId: any
  trackId: string
  curriculumId: string
  repeatFromSameHadith: CheckedState
  groups: Group[]
  cycleId: string
  questions: Record<string, Selectable<Question> & { grade: number }>[]
}

function makeGroup() {
  return {
    type: QuestionsGroupType.AUTOMATIC,
    questionsNumber: 25,
    gradePerQuestion: 1,
    difficulty: '',
    styleOrType: '',
    questions: {},
  }
}

function getGroupPath(index?: number): FieldPath<FieldValues> {
  if (index === undefined) return 'groups' as const
  return `groups.${index}` as const
}

export const NewSystemExamDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const utils = api.useUtils()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newSystemExamSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      groups: [makeGroup()],
      questions: [],
    },
  })

  const { trigger, getValues, setValue, control } = form

  const questions = useWatch({ control, name: 'questions' })

  const mutation = api.systemExam.create.useMutation()

  const {
    fields: groups,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const { data: cycles, isLoading: isCyclesLoading } = api.cycle.list.useQuery()

  const updateQuestions = () => {
    const groups = getValues(getGroupPath())
    const newQuestions = groups.map((g: Group) => {
      return { ...g.questions }
    })
    setValue('questions', newQuestions)
  }

  const setGroupQuestionsFactory = (groupIndex: number) => {
    return (
      questions:
        | Selectable<Question>[]
        | Selectable<Question>
        | ((
            oldGroupQuestions: Record<string, Selectable<Question>>
          ) => Selectable<Question>[] | Selectable<Question>)
    ) => {
      const groupPath = getGroupPath(groupIndex)
      const path = `${groupPath}.questions` as FieldPath<FieldValues>
      let newQuestions: Selectable<Question>[] | Selectable<Question>

      if (typeof questions === 'function') {
        newQuestions = questions(getValues(path))
      } else {
        newQuestions = questions
      }

      const questionsObject = (
        Array.isArray(newQuestions) ? newQuestions : [newQuestions]
      ).reduce((acc, q) => ({ ...acc, [q.id]: q }), {})
      setValue(path, questionsObject)
      updateQuestions()
    }
  }

  const appendGroup = () => {
    append(makeGroup())
  }

  const removeGroup = (index: number) => {
    remove(index)
    updateQuestions()
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
    setSubmitting(true)
    mutation
      // TODO: check this type and fix it
      .mutateAsync(data as any)
      .then(() => {
        toast.success('تم إضافة الإختبار بنجاح لكل الطلاب')
        setDialogOpen(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setSubmitting(false)
        utils.systemExam.invalidate()
      })
  }

  const getIsInsideShaded = () => {
    const _isInsideShaded = getValues('isInsideShaded')
    let isInsideShaded = undefined
    if (_isInsideShaded === 'INSIDE') {
      isInsideShaded = true
    } else {
      isInsideShaded = false
    }
    return isInsideShaded
  }

  const validateCommonFilters = () =>
    trigger([
      'courseId',
      'curriculumId',
      'type',
      'isInsideShaded',
      'trackId',
      'repeatFromSameHadith',
    ])

  const courseId = useWatch({
    control,
    name: 'courseId',
  })
  const isInsideShaded = useWatch({
    control,
    name: 'isInsideShaded',
  })
  const curriculumId = useWatch({
    control,
    name: 'curriculumId',
  })
  const type = useWatch({
    control,
    name: 'type',
  })

  // TODO: repeatFromSameHadith not working
  const getCommonFilters =
    (): inferRouterInputs<AppRouter>['question']['list']['filters'] => ({
      courseId: getValues('courseId'),
      isInsideShaded: getIsInsideShaded(),
      curriculum: {
        id: getValues('curriculumId'),
        type: getValues('type'),
      },
    })

  useEffect(() => {
    const groups = getValues(getGroupPath())
    for (let i = 0; i < groups.length; i++) {
      setValue(`${getGroupPath(i)}.questions` as FieldPath<FieldValues>, {})
    }
    updateQuestions()
  }, [courseId, isInsideShaded, curriculumId, type])

  const questionsCount = questions.reduce(
    (acc, objs) => acc + Object.keys(objs).length,
    0
  )

  const removeQuestion = (groupIndex: number, questionId: string) => {
    const groupPath = getGroupPath(groupIndex)
    const path = `${groupPath}.questions` as FieldPath<FieldValues>
    const groupQuestions = getValues(path)
    delete groupQuestions[questionId]
    setValue(path, { ...groupQuestions })
    updateQuestions()
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
          name='isInsideShaded'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المظلل</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value=''>داخل وخارج المظلل</SelectItem>
                  <SelectItem value='INSIDE'>بداخل المظلل فقط</SelectItem>
                  <SelectItem value='OUTSIDE'>خارج المظلل فقط</SelectItem>
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
        <CourseTrackCurriculumFormFields
          form={form}
          fields={{
            course: 'courseId',
            track: 'trackId',
            curriculum: 'curriculumId',
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
        <div>
          <h3 className='text-lg font-semibold'>تقسيمة الأسئلة</h3>
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
                    form={form}
                    setGroupQuestions={setGroupQuestionsFactory(index)}
                    getCommonFilters={getCommonFilters}
                    validateCommonFilters={validateCommonFilters}
                    fields={{
                      type: `${getGroupPath(
                        index
                      )}.type` as FieldPath<FieldValues>,
                      groupQuestions: `${getGroupPath(
                        index
                      )}.questions` as FieldPath<FieldValues>,
                      questionsNumber: `${getGroupPath(
                        index
                      )}.questionsNumber` as FieldPath<FieldValues>,
                      styleOrType: `${getGroupPath(
                        index
                      )}.styleOrType` as FieldPath<FieldValues>,
                      difficulty: `${getGroupPath(
                        index
                      )}.difficulty` as FieldPath<FieldValues>,
                      gradePerQuestion: `${getGroupPath(
                        index
                      )}.gradePerQuestion` as FieldPath<FieldValues>,
                    }}
                    index={index}
                    removeGroup={() => removeGroup(index)}
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
          <Button
            type='button'
            variant='success'
            className='mt-2 gap-2'
            onClick={appendGroup}
          >
            <PlusIcon className='h-4 w-4' />
            إضافة مجموعة
          </Button>
        </div>
        <div className='space-y-4 rounded-lg bg-gray-100 p-4'>
          <h3 className='text-lg font-semibold'>
            الأسئلة المختارة ({questionsCount})
          </h3>
          {questions.length > 0 ? (
            questions.map((questionsObj, gIndex) => {
              const groupQuestionsCount = Object.keys(questionsObj).length
              return (
                <div key={gIndex} className='space-y-2'>
                  <h4 className='font-semibold'>
                    أسئلة المجموعة {gIndex + 1} ({groupQuestionsCount})
                  </h4>
                  <div className='space-y-4'>
                    {Object.values(questionsObj).map((q) => (
                      <div
                        className='flex items-center gap-4 rounded bg-gray-200 p-4'
                        key={q.id}
                      >
                        <div className='flex-1 space-y-2'>
                          <QuestionCard
                            question={q}
                            style={(q as any).style}
                            showPartNumber
                            showPageNumber
                            showHadithNumber
                          />
                          <FormField
                            control={control}
                            name={
                              `questions.${q.id}.grade` as FieldPath<FieldValues>
                            }
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الدرجة</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    {...field}
                                    defaultValue={1}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          size='icon'
                          type='button'
                          variant='destructive'
                          onClick={() => removeQuestion(gIndex, q.id)}
                        >
                          <TrashIcon className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <p>لم يتم اختيار أسئلة</p>
          )}
        </div>
        <FormField
          control={form.control}
          name='cycleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدورة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCyclesLoading}
                  >
                    <SelectValue placeholder='اختر الدورة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.data?.map((cycle) => (
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
