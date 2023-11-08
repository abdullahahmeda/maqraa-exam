import {
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from './ui/accordion'
import { Button } from './ui/button'
import { useSortable } from '@dnd-kit/sortable'
import {
  UseFormReturn,
  UseFieldArrayRemove,
  useWatch,
  UseFormRegister,
} from 'react-hook-form'
import {
  FormControl,
  FormItem,
  FormMessage,
  FormField,
  FormLabel,
} from './ui/form'
import { Loader2, Trash } from 'lucide-react'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  difficultyMapping,
  enStyleToAr,
  enTypeToAr,
  styleMapping,
  typeMapping,
} from '~/utils/questions'
import { CSS } from '@dnd-kit/utilities'
import { Question } from '~/kysely/types'
import {
  QuestionDifficulty,
  QuestionStyle,
  QuestionType,
  QuestionsGroupType,
  QuizType,
} from '~/kysely/enums'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { api } from '~/utils/api'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { cn } from '~/lib/utils'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { useState } from 'react'
import { Badge } from './ui/badge'
import sampleSize from 'lodash.samplesize'

type ManualGroup = {
  type: typeof QuestionsGroupType.MANUAL
  questions: { [index: string]: { id: string; weight: number } }
}

type AutomaticGroup = {
  type: typeof QuestionsGroupType.AUTOMATIC
  questionsNumber: number
  gradePerQuestion: number
  difficulty: QuestionDifficulty | string | undefined
  styleOrType: QuestionStyle | QuestionType | string | undefined
  questions: { id: string; weight: number }[]
}

export type Group = AutomaticGroup | ManualGroup

type FieldValues = {
  type: string
  courseId: string
  curriculumId: string
  groups: Group[]
}

const ListRow = ({
  index,
  style,
  data,
}: {
  index: number
  style: any
  data: {
    rows: Question[]
    groupIndex: number
    form: UseFormReturn<FieldValues>
    filteredIndexes: number[]
  }
}) => {
  const originalIndex = `x${data.filteredIndexes[index]}`
  const question = data.rows[index] as Question
  return (
    <div
      style={style}
      className={cn(
        'overflow-hidden rounded-md p-4',
        index % 2 === 0 && 'bg-muted'
      )}
    >
      <FormField
        control={data.form.control}
        name={`groups.${data.groupIndex}.questions`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox
                checked={!!field.value?.[originalIndex]}
                onCheckedChange={(checked) => {
                  const newObj = { ...field.value }
                  if (!checked) delete newObj[originalIndex]
                  else newObj[originalIndex] = { id: question.id, weight: 1 }
                  field.onChange(newObj)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <p>
        رقم السؤال: {question.number}، رقم الجزء: {question.partNumber}، رقم
        الصفحة: {question.pageNumber}، رقم الحديث: {question.hadithNumber}
      </p>
      <div>
        نوع السؤال: {enTypeToAr(question.type)}{' '}
        <Badge>{enStyleToAr(question.style)}</Badge>
      </div>
      <p>السؤال: {question.text}</p>
    </div>
  )
}

export const QuestionGroup = ({
  id,
  index: groupIndex,
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

  const [questionNumber, setQuestionNumber] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [hadithNumber, setHadithNumber] = useState('')
  const [onlySelected, setOnlySelected] = useState(false)

  const courseId = useWatch({
    control: form.control,
    name: 'courseId',
  })

  const curriculumId = useWatch({
    control: form.control,
    name: 'curriculumId',
  })

  const examType = useWatch({
    control: form.control,
    name: `type`,
  })

  const groupType = useWatch({
    control: form.control,
    name: `groups.${groupIndex}.type`,
  })

  const gradePerQuestion = useWatch({
    control: form.control,
    name: `groups.${groupIndex}.gradePerQuestion`,
  })

  const selectedQuestions = useWatch({
    control: form.control,
    name: `groups.${groupIndex}.questions`,
  })

  const {
    data: questions,
    isLoading: isManualQuestionsLoading,
    fetchStatus: manualQuestionsFetchStatus,
  } = api.question.list.useQuery(
    {
      filters: {
        courseId: courseId as string,
        curriculum: { id: curriculumId, type: examType as QuizType },
      },
    },
    {
      enabled: !!curriculumId && !!courseId && !!examType,
      staleTime: Infinity,
    }
  )

  const manualFilteredIndexes: number[] = []

  for (const [index, q] of [...(questions || []).entries()]) {
    const conditions = []

    if (questionNumber) conditions.push(q.number === +questionNumber)
    if (partNumber) conditions.push(q.partNumber === +partNumber)
    if (pageNumber) conditions.push(q.pageNumber === +pageNumber)
    if (hadithNumber) conditions.push(q.hadithNumber === +hadithNumber)
    if (onlySelected)
      conditions.push(
        selectedQuestions &&
          (selectedQuestions as any)[`x${index}`] !== undefined
      )
    if (conditions.every((c) => c === true)) manualFilteredIndexes.push(index)
  }

  const manualFilteredQuestions = manualFilteredIndexes.map(
    (i) => questions?.[i] as Question
  )

  const [automaticFilteredQuestions, setAutomaticFilteredQuestions] = useState<
    Question[]
  >([])

  const generateQuestions = () => {
    const questionsNumber = form.getValues(
      `groups.${groupIndex}.questionsNumber`
    )
    const difficulty = form.getValues(`groups.${groupIndex}.difficulty`)
    const styleOrType = form.getValues(`groups.${groupIndex}.styleOrType`)
    const newQuestions = sampleSize(
      (questions || []).filter((q) => {
        const conditions = []
        if (difficulty) conditions.push(q.difficulty === difficulty)
        if (styleOrType) {
          if (styleOrType === 'MCQ' || styleOrType === 'WRITTEN')
            conditions.push(q.type === styleOrType)
          else conditions.push(q.style === styleOrType)
        }

        return conditions.every((c) => c === true)
      }),
      questionsNumber
    )
    setAutomaticFilteredQuestions(newQuestions)

    form.setValue(
      `groups.${groupIndex}.questions`,
      newQuestions.map((q) => ({
        id: q.id,
        weight: gradePerQuestion,
      }))
    )
  }

  return (
    <AccordionItem
      value={id}
      ref={setNodeRef}
      {...attributes}
      style={style}
      className='transition-transform last-of-type:border-b-0'
    >
      <AccordionTrigger {...listeners} className='bg-gray-50 p-3'>
        المجموعة {groupIndex + 1}
      </AccordionTrigger>
      <AccordionContent className='bg-gray-50/50'>
        <div className='space-y-4 p-4 pb-0'>
          <div className='flex justify-end'>
            <Button
              size='icon'
              variant='destructive'
              onClick={() => remove(groupIndex)}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
          <Tabs
            value={groupType}
            onValueChange={(value: string) => {
              form.setValue(
                `groups.${groupIndex}.type`,
                value as QuestionsGroupType
              )
              if (value === QuestionsGroupType.MANUAL)
                form.setValue(`groups.${groupIndex}.questions`, {})
              else {
                setAutomaticFilteredQuestions([])
                form.setValue(`groups.${groupIndex}.questions`, [])
              }
            }}
          >
            <div className='mx-4'>
              <TabsList className='mb-4 grid grid-cols-2'>
                <TabsTrigger value={QuestionsGroupType.AUTOMATIC}>
                  تلقائي
                </TabsTrigger>
                <TabsTrigger value={QuestionsGroupType.MANUAL}>
                  يدوي
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={QuestionsGroupType.AUTOMATIC}>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name={`groups.${groupIndex}.questionsNumber`}
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
                  name={`groups.${groupIndex}.gradePerQuestion`}
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
                <FormField
                  control={form.control}
                  name={`groups.${groupIndex}.difficulty`}
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
                  name={`groups.${groupIndex}.styleOrType`}
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
                          <SelectItem value=''>عشوائي</SelectItem>
                          {Object.entries(typeMapping).map(([label, value]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
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
              <Button
                type='button'
                className='mt-4'
                onClick={generateQuestions}
              >
                توليد
              </Button>
              <h4 className='mb-2 mt-4 text-lg font-semibold'>
                الأسئلة المختارة
              </h4>
              <div className='space-y-2'>
                {automaticFilteredQuestions.map((question, index) => (
                  <div key={question.id} className='rounded-md bg-gray-200 p-4'>
                    <input
                      type='hidden'
                      {...form.register(
                        `groups.${groupIndex}.questions.${index}.id`,
                        { value: question.id }
                      )}
                    />
                    <Badge>{enStyleToAr(question.style)}</Badge> {question.text}
                    <FormField
                      control={form.control}
                      name={`groups.${groupIndex}.questions.${index}.weight`}
                      render={({
                        field: {
                          onChange,
                          value = gradePerQuestion || 1,
                          ...field
                        },
                      }) => (
                        <FormItem className='mt-2'>
                          <FormLabel>الدرجة</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              value={+value}
                              onChange={(e) => onChange(Number(e.target.value))}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
              <p className='text-sm font-medium text-destructive'>
                {
                  (form.formState.errors.groups?.[groupIndex] as any)?.questions
                    ?.message
                }
              </p>
            </TabsContent>
            <TabsContent value={QuestionsGroupType.MANUAL}>
              <h4 className='mb-2 text-lg font-semibold'>
                اختر الأسئلة المراد إضافتها
              </h4>
              {!curriculumId && (
                <p className='text-black/60'>يجب اختيار المنهج أولاً.</p>
              )}
              {manualQuestionsFetchStatus !== 'idle' &&
                isManualQuestionsLoading && (
                  <Loader2 className='mt-4 animate-spin' />
                )}
              {questions && (
                <>
                  <div>
                    <h5 className='font-semibold'>الفلاتر</h5>
                    <div className='mt-2 flex gap-2'>
                      <div>
                        <Label>رقم السؤال</Label>
                        <Input
                          type='number'
                          value={questionNumber}
                          onChange={(e) => setQuestionNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>رقم الجزء</Label>
                        <Input
                          type='number'
                          value={partNumber}
                          onChange={(e) => setPartNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>رقم الصفحة</Label>
                        <Input
                          type='number'
                          value={pageNumber}
                          onChange={(e) => setPageNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>رقم الحديث</Label>
                        <Input
                          type='number'
                          value={hadithNumber}
                          onChange={(e) => setHadithNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='mb-4 mt-2 flex items-center gap-2'>
                      <Checkbox
                        checked={onlySelected}
                        onCheckedChange={(checked) =>
                          setOnlySelected(checked as boolean)
                        }
                      />
                      <p>عرض الأسئلة المختارة فقط</p>
                    </div>
                  </div>
                  <div className='h-[400px]'>
                    <AutoSizer>
                      {({ width }) => {
                        return (
                          <FixedSizeList
                            className='rounded-md border'
                            direction='rtl'
                            height={400}
                            itemCount={manualFilteredQuestions?.length || 0}
                            itemSize={150}
                            width={width}
                            itemData={{
                              rows: manualFilteredQuestions || [],
                              form: form,
                              groupIndex: groupIndex,
                              filteredIndexes: manualFilteredIndexes,
                            }}
                          >
                            {ListRow}
                          </FixedSizeList>
                        )
                      }}
                    </AutoSizer>
                  </div>
                  <div className='mt-4'>
                    <h4 className='text-lg font-semibold'>الأسئلة المختارة</h4>
                    {Object.keys({ ...selectedQuestions }).length === 0 && (
                      <p className='text-black/60'>لم يتم إضافة أسئلة</p>
                    )}
                    <div className='space-y-2'>
                      {Object.keys({ ...selectedQuestions }).map(
                        (key, listIndex) => {
                          const qIndex = +key.substring(1) as number
                          const question = questions?.[qIndex] as Question
                          return (
                            <div
                              key={key}
                              className='rounded-md bg-gray-200 p-4'
                            >
                              <Badge>{enStyleToAr(question.style)}</Badge>{' '}
                              {question.text}
                              <FormField
                                control={form.control}
                                name={`groups.${groupIndex}.questions.${key}.weight`}
                                render={({
                                  field: { onChange, value = 1, ...field },
                                }) => (
                                  <FormItem className='mt-2'>
                                    <FormLabel>الدرجة</FormLabel>
                                    <FormControl>
                                      <Input
                                        type='number'
                                        value={value}
                                        onChange={(e) =>
                                          onChange(Number(e.target.value))
                                        }
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                </>
              )}
              <p className='text-sm font-medium text-destructive'>
                {
                  (form.formState.errors.groups?.[groupIndex] as any)?.questions
                    ?.message
                }
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
