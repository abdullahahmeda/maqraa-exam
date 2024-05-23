'use client'

import { ar } from 'date-fns/locale'
import { type Selectable } from 'kysely'
import { SearchIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  useWatch,
  useFieldArray,
  type FieldValues,
  type FieldPath,
  type UseFormReturn,
  type Path,
  type ArrayPath,
  type FieldArray,
  type PathValue,
} from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { CourseTrackCurriculumFormFields } from '~/components/course-track-curriculum-form-fields'
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
}
export type EditExamFieldValues = { id: string } & NewExamFieldValues

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  cycles: Selectable<Cycle>[]
  courses: Selectable<Course>[]
}

const AutomaticQuestionsFormFields = <T extends FieldValues>({
  filters,
  form,
  path,
}: {
  filters: { courseId: string; curriculumId: string; curriculumType: QuizType }
  form: UseFormReturn<T>
  path: string
}) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState<'all' | QuestionDifficulty>(
    'all',
  )
  const [type, setType] = useState<'all' | QuestionType>('all')

  const { refetch: fetchRandomQuestions, isFetching } =
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
      { enabled: false },
    )

  const generateQuestions = () => {
    void fetchRandomQuestions().then(({ data: questions }) => {
      if (questions) {
        const weight = isNaN(form.getValues(`${path}.weight` as Path<T>))
          ? 1
          : Number(form.getValues(`${path}.weight` as Path<T>))

        form.setValue(
          `${path}.questions` as Path<T>,
          questions.map((q) => ({ ...q, weight })) as PathValue<T, Path<T>>,
        )
      }
    })
  }

  const defaultWeight = useWatch({
    control: form.control,
    name: `${path}.weight` as Path<T>,
  })

  useEffect(() => {
    const groupQuestions = form.getValues(
      `${path}.questions` as Path<T>,
    ) as (Selectable<Question> & { weight: number })[]

    form.setValue(
      `${path}.questions` as Path<T>,
      groupQuestions.map((g) => ({ ...g, weight: defaultWeight })) as PathValue<
        T,
        Path<T>
      >,
    )
  }, [defaultWeight])

  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name={`${path}.weight` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الدرجة للسؤال الواحد</FormLabel>
            <FormControl>
              <Input type='number' min={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
        <Select
          onValueChange={(v) => setDifficulty(v as 'all' | QuestionDifficulty)}
          value={difficulty}
        >
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
        <Select
          onValueChange={(v) => setType(v as 'all' | QuestionType)}
          value={type}
        >
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
      <Button
        type='button'
        onClick={() => generateQuestions()}
        loading={isFetching}
      >
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
  filters: { courseId: string; curriculumId: string; curriculumType: QuizType }
  path: FieldPath<T>
  form: UseFormReturn<T>
}) => {
  const [questionNumber, setQuestionNumber] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [hadithNumber, setHadithNumber] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)

  const { ref, inView } = useInView({
    // rootMargin: '0px 0px 0px 0px',
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
    name: `${path}.questions` as Path<T>,
  }) as (Selectable<Question> & { weight: number })[]

  const searchQuestions = async () => {
    void refetch()
  }

  useEffect(() => {
    if (inView && isFetched && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView])

  const addOrRemoveQuestion = (question: Selectable<Question>) => {
    const newGroupQuestions = [...groupQuestions]
    const qIndex = groupQuestions.findIndex((q) => q.id === question.id)
    if (qIndex > -1) {
      newGroupQuestions.splice(qIndex, 1)
    } else {
      const weight = isNaN(form.getValues(`${path}.weight` as Path<T>))
        ? 1
        : Number(form.getValues(`${path}.weight` as Path<T>))
      newGroupQuestions.push({ ...question, weight })
    }
    form.setValue(
      `${path}.questions` as Path<T>,
      newGroupQuestions as PathValue<T, Path<T>>,
    )
  }

  const defaultWeight = useWatch({
    control: form.control,
    name: `${path}.weight` as Path<T>,
  })

  useEffect(() => {
    const groupQuestions = form.getValues(
      `${path}.questions` as Path<T>,
    ) as (Selectable<Question> & { weight: number })[]

    form.setValue(
      `${path}.questions` as Path<T>,
      groupQuestions.map((g) => ({ ...g, weight: defaultWeight })) as PathValue<
        T,
        Path<T>
      >,
    )
  }, [defaultWeight])

  return (
    <div>
      <div className='mb-4 space-y-4'>
        <FormField
          control={form.control}
          name={`${path}.weight` as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدرجة للسؤال الواحد</FormLabel>
              <FormControl>
                <Input type='number' min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className='h-1' ref={ref} />
        {(isLoading || hasNextPage) && (
          <div className='m-4 flex justify-center'>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}

// const ImportFromModelOrExamFormFields = <T extends FieldValues>({
//   form,
// }: {
//   form: UseFormReturn<T>
// }) => {
//   const [type, setType] = useState('exam')

//   const { data: exams, isLoading: isExamsLoading } = api.exam.list.useQuery()
//   // const { data: models } = api.model.list.useQuery()

//   return (
//     <RadioGroup value={type} onValueChange={(v) => setType(v)}>
//       <div className='flex items-center gap-2'>
//         <RadioGroupItem value='exam' id='from-exam' />
//         <Label htmlFor='from-exam'>من اختبار</Label>
//       </div>
//       {type === 'exam' && (
//         <FormField
//           control={form.control}
//           name={'import.examId' as FieldPath<T>}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>الاختبار</FormLabel>
//               <FormControl>
//                 <Combobox
//                   items={exams?.data ?? []}
//                   loading={isExamsLoading}
//                   labelKey='name'
//                   valueKey='id'
//                   onSelect={field.onChange}
//                   value={field.value}
//                   triggerText='الكل'
//                   triggerClassName='w-full'
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       )}
//     </RadioGroup>
//   )
// }

const GroupQuestions = <T extends FieldValues>({
  form,
  path,
}: {
  form: UseFormReturn<T>
  path: string
}) => {
  const groupQuestions = useWatch({
    control: form.control,
    name: `${path}.questions` as Path<T>,
  }) as (Selectable<Question> & { weight: number })[]

  const deleteQuestion = (index: number) => {
    form.setValue(
      `${path}.questions` as Path<T>,
      groupQuestions.filter((_, i) => i !== index) as PathValue<T, Path<T>>,
    )
  }

  const totalGroupWeight = groupQuestions.reduce((acc, q) => acc + +q.weight, 0)

  return (
    <div className='space-y-2'>
      <p>
        {groupQuestions.length} أسئلة ({totalGroupWeight} درجة)
      </p>
      <TooltipProvider delayDuration={100}>
        {groupQuestions.map((question, index) => (
          <QuestionCard key={question.id}>
            <div className='flex justify-end'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size='icon'
                    variant='destructive'
                    onClick={() => deleteQuestion(index)}
                  >
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>حذف السؤال من المجموعة</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <QuestionCardText text={question.text} />
            <FormField
              control={form.control}
              name={`${path}.questions.${index}.weight` as FieldPath<T>}
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
      </TooltipProvider>
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
    name: 'courseId' as Path<T>,
  }) as string

  const curriculumId = useWatch({
    control: form.control,
    name: 'curriculumId' as Path<T>,
  }) as string

  const curriculumType = useWatch({
    control: form.control,
    name: 'type' as Path<T>,
  }) as QuizType

  const {
    fields: groups,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'groups' as ArrayPath<T>,
  })

  const addQuestionGroup = () => {
    append({
      weight: 1,
      questions: [],
    } as FieldArray<T, ArrayPath<T>>)
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
        name={'type' as Path<T>}
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
        <TabsList className='grid w-full grid-cols-1'>
          <TabsTrigger value='generate'>توليد أسئلة</TabsTrigger>
          {/* <TabsTrigger value='preset'>أسئلة من نموذج</TabsTrigger> */}
        </TabsList>
        <TabsContent value='generate'>
          {groups.map((group, index) => {
            return (
              <div key={group.id} className='border rounded-md p-4'>
                <div className='flex justify-between mb-2'>
                  <p>المجموعة {index + 1}</p>
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => removeGroup(index)}
                    disabled={groups.length < 2}
                    className='gap-2'
                  >
                    <TrashIcon className='h-4 w-4' />
                    حذف المجموعة
                  </Button>
                </div>
                <Tabs defaultValue='automatic'>
                  <TabsList className='grid grid-cols-2 w-full'>
                    <TabsTrigger value='automatic'>تلقائي</TabsTrigger>
                    <TabsTrigger value='manual'>يدوي</TabsTrigger>
                  </TabsList>
                  <TabsContent value='automatic'>
                    <AutomaticQuestionsFormFields
                      form={form}
                      path={`groups.${index}` as FieldPath<T>}
                      filters={{
                        courseId,
                        curriculumId,
                        curriculumType,
                      }}
                    />
                  </TabsContent>
                  <TabsContent value='manual'>
                    <ManualQuestionsFormFields
                      form={form}
                      path={`groups.${index}` as FieldPath<T>}
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
        {/* <TabsContent value='preset'>
          <ImportFromModelOrExamFormFields form={form} />
        </TabsContent> */}
      </Tabs>
    </>
  )
}
