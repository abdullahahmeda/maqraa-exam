'use client'

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ar } from 'date-fns/locale'
import { Selectable } from 'kysely'
import { PlusIcon, SearchIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  type FieldValues,
  type Control,
  type FieldPath,
  type UseFormReturn,
  useWatch,
  useFieldArray,
} from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { CourseTrackCurriculumFormFields } from '~/components/course-track-curriculum-form-fields'
import { type FormFieldsCommonProps } from '~/components/questions-group'
import { Accordion } from '~/components/ui/accordion'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Combobox } from '~/components/ui/combobox'
import { DatePicker } from '~/components/ui/date-picker'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { QuestionCard, QuestionCardText } from '~/components/ui/question-card'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Spinner } from '~/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { QuestionDifficulty, QuestionType, QuizType } from '~/kysely/enums'
import type { Course, Cycle, Question } from '~/kysely/types'
import { api } from '~/trpc/react'
import { difficultyMapping, typeMapping } from '~/utils/questions'

export type Group = {
  // type: string
  // questions: Record<string, Selectable<Question>>
  // questionsNumber: number
  // gradePerQuestion: number
  // difficulty: string
  // styleOrType: string
  weight: number
  questions: (Selectable<Question> & { weight: number })[]
}

export type NewExamFieldValues = {
  name: string
  cycleId: string
  courseId: string
  trackId: string
  curriculumId: string
  endsAt: Date | null | undefined
  type: QuizType
  // isInsideShaded: string
  // repeatFromSameHadith: CheckedState
  groups: Group[]
  // questions: Record<string, Selectable<Question> & { weight: number }>[]
}
export type EditExamFieldValues = { id: string } & NewExamFieldValues

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  cycles: Selectable<Cycle>[]
  courses: Selectable<Course>[]
}

// type Props = FormFieldsCommonProps & {
//   groupQuestions: Record<string, Selectable<Question>>
// }

const AutomaticQuestionsFormFields = <T extends FieldValues>({
  filters,
  form,
  path,
}: {
  filters: { courseId: string; curriculumId: string; curriculumType: string }
  form: UseFormReturn<T>
  path: string
}) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState<'all' | QuestionDifficulty>(
    'all',
  )
  const [type, setType] = useState<'all' | QuestionType>('all')

  const { data: questions, refetch: generateQuestions } =
    api.question.listRandom.useQuery(
      {
        filters: {
          courseId: filters.courseId,
          difficulty: difficulty === 'all' ? undefined : difficulty,
          type: type === 'all' ? undefined : type,
          curriculum: {
            id: filters.curriculumId,
            type: filters.curriculumType,
          },
        },
        include: { style: true },
        limit: numberOfQuestions,
      },
      {
        enabled: false,
      },
    )

  useEffect(() => {
    console.log('questions changed')
    if (questions) {
      const weight = isNaN(form.getValues(`${path}.weight`))
        ? 1
        : Number(form.getValues(`${path}.weight`))

      form.setValue(
        `${path}.questions`,
        questions.map((q) => ({ ...q, weight })),
      )
    }
  }, [questions])

  return (
    <div className='space-y-4'>
      <div>
        <Label>عدد الأسئلة المطلوب</Label>
        <Input
          type='number'
          value={numberOfQuestions}
          onChange={(e) => {
            if (!isNaN(e.target.valueAsNumber))
              setNumberOfQuestions(e.target.valueAsNumber)
          }}
        />
      </div>
      <div>
        <Label>المستوى</Label>
        <Select onValueChange={setDifficulty} value={difficulty}>
          <SelectTrigger>
            <SelectValue placeholder='اختر المستوى' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>كل المستويات</SelectItem>
            {Object.entries(difficultyMapping).map(([label, value]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>نوع الأسئلة</Label>
        <Select onValueChange={setType} value={type}>
          <SelectTrigger>
            <SelectValue placeholder='اختر طريقة الأسئلة' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>موضوعي ومقالي</SelectItem>
            {Object.entries(typeMapping).map(([label, value]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type='button' onClick={() => generateQuestions()}>
        توليد
      </Button>
    </div>
  )
}

const ManualQuestionsFormFields = <T extends FieldValues>({
  filters,
  path,
  form,
}: {
  filters: { courseId: string; curriculumId: string; curriculumType: string }
  path: FieldPath<T>
  form: UseFormReturn<T>
}) => {
  const [questionNumber, setQuestionNumber] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [hadithNumber, setHadithNumber] = useState('')

  const [validData, setValidData] = useState(false)

  // const validateDataForFetching = validateCommonFilters

  const rootRef = useRef<HTMLDivElement>(null)

  const { ref, inView } = useInView({
    rootMargin: '0px 0px 400px 0px',
    root: rootRef.current,
  })

  const {
    data: questions,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetched,
  } = api.question.infiniteList.useInfiniteQuery(
    {
      filters: {
        courseId: filters.courseId,
        curriculum: {
          id: filters.curriculumId,
          type: filters.curriculumType,
        },
        number: questionNumber || undefined,
        partNumber: partNumber || undefined,
        pageNumber: pageNumber || undefined,
        hadithNumber: hadithNumber || undefined,
      },
      include: { style: true },
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const groupQuestions = useWatch({
    control: form.control,
    name: `${path}.questions`,
  })

  const searchQuestions = async () => {
    // const isValidData = await validateDataForFetching()
    // if (!isValidData) {
    //   setValidData(false)
    //   return
    // }
    // setValidData(true)

    void refetch()
  }

  useEffect(() => {
    void searchQuestions()
  }, [])

  useEffect(() => {
    if (inView && isFetched && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView])

  const addOrRemoveQuestion = (question: Selectable<Question>) => {
    let newGroupQuestions = [...groupQuestions]
    const qIndex = groupQuestions.findIndex((q) => q.id === question.id)
    if (qIndex > -1) {
      newGroupQuestions.splice(qIndex, 1)
    } else {
      const weight = isNaN(form.getValues(`${path}.weight`))
        ? 1
        : Number(form.getValues(`${path}.weight`))
      newGroupQuestions.push({ ...question, weight })
    }
    form.setValue(`${path}.questions`, newGroupQuestions)
  }

  return (
    <div>
      <div className='mb-4 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <FormItem>
              <FormLabel>رقم السؤال</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={questionNumber}
                  onChange={(e) => setQuestionNumber(e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الجزء</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الصفحة</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الحديث</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={hadithNumber}
                  onChange={(e) => setHadithNumber(e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
        </div>
        <Button
          type='button'
          className='gap-2'
          onClick={searchQuestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className='h-4 w-4' />
          ) : (
            <SearchIcon className='h-4 w-4' />
          )}
          بحث
        </Button>
      </div>

      <div
        className='max-h-96 overflow-auto rounded-md bg-gray-50 p-4'
        ref={rootRef}
      >
        <div className='space-y-4'>
          {questions?.pages.flatMap((page) =>
            page.data.map((question) => (
              <div key={question.id} className='flex items-center gap-2'>
                <Checkbox
                  onCheckedChange={() => addOrRemoveQuestion(question)}
                  checked={groupQuestions.some((q) => q.id === question.id)}
                />
                <QuestionCard className='flex-1'>
                  <QuestionCardText text={question.text} />
                  <div className='flex gap-2'>
                    <Badge>رقم الجزء: {question.partNumber}</Badge>
                    <Badge>رقم الصفحة: {question.pageNumber}</Badge>
                    <Badge>رقم الحديث: {question.hadithNumber}</Badge>
                    <Badge>نوع السؤال: {question.style?.name}</Badge>
                  </div>
                </QuestionCard>
              </div>
            )),
          )}
        </div>
        <div ref={ref} />
        {validData ? (
          (isLoading || hasNextPage) && (
            <div className='m-4 flex justify-center'>
              <Spinner />
            </div>
          )
        ) : (
          <p className='text-center'>
            قم بتعبئة الحقول اللازمة أولاُ ثم اضغط على زر البحث
          </p>
        )}
      </div>
    </div>
  )
}

const ImportFromModelOrExamFormFields = <T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) => {
  const [type, setType] = useState('exam')

  const { data: exams, isLoading: isExamsLoading } = api.exam.list.useQuery()
  // const { data: models } = api.model.list.useQuery()

  return (
    <RadioGroup value={type} onValueChange={(v) => setType(v)}>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='exam' id='from-exam' />
        <Label htmlFor='from-exam'>من اختبار</Label>
      </div>
      {type === 'exam' && (
        <FormField
          control={form.control}
          name={'import.examId' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاختبار</FormLabel>
              <FormControl>
                <Combobox
                  items={exams?.data ?? []}
                  loading={isExamsLoading}
                  labelKey='name'
                  valueKey='id'
                  onSelect={field.onChange}
                  value={field.value}
                  triggerText='الكل'
                  triggerClassName='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {/* <div className='flex items-center gap-2'>
        <RadioGroupItem value='model' id='from-model' />
        <Label htmlFor='from-model'>من نموذج</Label>
      </div>
      {type === 'model' && (
        <FormField
          control={control}
          name={'import.modelId' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>النموذج</FormLabel>
              <FormControl>
                <Combobox items={models?.data ?? []} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
      )} */}
    </RadioGroup>
  )
}

const GroupQuestions = <T extends FieldValues>({
  form,
  path,
}: {
  form: UseFormReturn<T>
  path: string
}) => {
  const groupQuestions = useWatch({
    control: form.control,
    name: `${path}.questions`,
  })

  const deleteQuestion = (index: number) => {
    // form.unregister(`${path}.questions.${index}`)
    form.setValue(
      `${path}.questions`,
      groupQuestions.filter((_, i) => i !== index),
    )
  }

  return (
    <div className='space-y-2'>
      <p>الأسئلة ({groupQuestions.length})</p>
      {groupQuestions.map((question, index) => (
        <QuestionCard key={question.id}>
          <Button
            type='button'
            size='icon'
            variant='destructive'
            onClick={() => deleteQuestion(index)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
          <QuestionCardText text={question.text} />
          <FormField
            control={form.control}
            name={`${path}.questions.${index}.weight`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدرجات للسؤال</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </QuestionCard>
      ))}
    </div>
  )
}

export const ExamFormFields = <T extends FieldValues>({
  form,
  cycles,
  courses,
}: FormProps<T>) => {
  const courseId = useWatch({
    control: form.control,
    name: 'courseId',
  })

  const curriculumId = useWatch({
    control: form.control,
    name: 'curriculumId',
  })

  const curriculumType = useWatch({
    control: form.control,
    name: 'type',
  })

  const {
    fields: groups,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const addQuestionGroup = () => {
    append({
      weight: 1,
      questions: [],
    } as Group)
  }

  const removeGroup = (index: number) => {
    remove(index)
  }

  return (
    <>
      <FormField
        control={form.control}
        name={'name' as FieldPath<T>}
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
        name={'cycleId' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الدورة</FormLabel>
            <FormControl>
              <Combobox
                items={cycles}
                labelKey='name'
                valueKey='id'
                onSelect={field.onChange}
                value={field.value}
                triggerText='الكل'
                triggerClassName='w-full'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <CourseTrackCurriculumFormFields
        form={form}
        fields={{
          course: 'courseId' as FieldPath<T>,
          track: 'trackId' as FieldPath<T>,
          curriculum: 'curriculumId' as FieldPath<T>,
        }}
      />
      <FormField
        control={form.control}
        name={'endsAt' as FieldPath<T>}
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>تاريخ قفل الإختبار</FormLabel>
            <FormControl>
              <DatePicker
                selected={field.value ?? undefined}
                onSelect={field.onChange}
                disabled={(date: Date) => date < new Date()}
                mode='single'
                locale={ar}
              />
            </FormControl>
            <FormDescription>
              اتركه فارعاً إن كان الإختبار مفتوح. قم باختيار نفس التاريخ لإزالة
              الاختيار
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <h3>الأسئلة</h3>
      <Tabs defaultValue='generate'>
        <TabsList>
          <TabsTrigger value='generate'>توليد أسئلة</TabsTrigger>
          <TabsTrigger value='preset'>أسئلة من نموذج</TabsTrigger>
        </TabsList>
        <TabsContent value='generate'>
          {groups.map((group, index) => {
            return (
              <div key={group.id} className='border rounded-md p-4'>
                <p>المجموعة {index + 1}</p>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type='button'
                        size='icon'
                        variant='destructive'
                        onClick={() => removeGroup(index)}
                        disabled={groups.length < 2}
                      >
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>حذف</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Tabs defaultValue='automatic'>
                  <TabsList className='grid grid-cols-3 w-full'>
                    <TabsTrigger value='automatic'>تلقائي</TabsTrigger>
                    <TabsTrigger value='manual'>يدوي</TabsTrigger>
                  </TabsList>
                  <TabsContent value='automatic'>
                    <FormField
                      control={form.control}
                      name={`groups.${index}.weight`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الدرجة للسؤال الواحد</FormLabel>
                          <FormControl>
                            <Input type='number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AutomaticQuestionsFormFields
                      form={form}
                      path={`groups.${index}`}
                      filters={{
                        courseId,
                        curriculumId,
                        curriculumType,
                      }}
                    />
                  </TabsContent>
                  <TabsContent value='manual'>
                    <FormField
                      control={form.control}
                      name={`groups.${index}.weight`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الدرجة للسؤال الواحد</FormLabel>
                          <FormControl>
                            <Input type='number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ManualQuestionsFormFields
                      form={form}
                      path={`groups.${index}`}
                      filters={{
                        courseId,
                        curriculumId,
                        curriculumType,
                      }}
                    />
                  </TabsContent>
                </Tabs>
                <div className='mt-4'>
                  <GroupQuestions form={form} path={`groups.${index}`} />
                </div>
              </div>
            )
          })}
          <Button type='button' variant='secondary' onClick={addQuestionGroup}>
            إضافة مجموعة أسئلة
          </Button>
        </TabsContent>
        <TabsContent value='preset'>
          <ImportFromModelOrExamFormFields form={form} />
        </TabsContent>
      </Tabs>

      {/* <FormField
        control={form.control}
        name={'type' as FieldPath<T>}
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
        name={'isInsideShaded' as FieldPath<T>}
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
        name={'repeatFromSameHadith' as FieldPath<T>}
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
                      index,
                    )}.type` as FieldPath<FieldValues>,
                    groupQuestions: `${getGroupPath(
                      index,
                    )}.questions` as FieldPath<FieldValues>,
                    questionsNumber: `${getGroupPath(
                      index,
                    )}.questionsNumber` as FieldPath<FieldValues>,
                    styleOrType: `${getGroupPath(
                      index,
                    )}.styleOrType` as FieldPath<FieldValues>,
                    difficulty: `${getGroupPath(
                      index,
                    )}.difficulty` as FieldPath<FieldValues>,
                    gradePerQuestion: `${getGroupPath(
                      index,
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
          name={'groups' as FieldPath<T>}
          render={() => (
            <FormItem>
              <FormMessage className='mt-2'>يوجد خطأ</FormMessage>
            </FormItem>
          )}
        />
        <Button
          type='button'
          // variant='success'
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
                            `questions.${gIndex}.${q.id}.grade` as FieldPath<FieldValues>
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الدرجة</FormLabel>
                              <FormControl>
                                <Input type='number' {...field} />
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
        name={'cycleId' as FieldPath<T>}
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
                {cycles.map((cycle) => (
                  <SelectItem key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </>
  )
}
