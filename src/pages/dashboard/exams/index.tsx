import {
  Course,
  Curriculum,
  CurriculumPart,
  Cycle,
  Exam,
  ExamType,
  QuestionDifficulty,
  QuestionStyle,
  QuestionType,
  User,
  UserRole,
} from '@prisma/client'
import {
  ColumnFilter,
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { z } from 'zod'
import { Button, buttonVariants } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import { api, getBaseUrl } from '~/utils/api'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { DataTable } from '~/components/ui/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { FileCheck2, Filter, Trash, Link as LinkIcon } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { formatDate } from '~/utils/formatDate'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { typeMapping, styleMapping, difficultyMapping } from '~/utils/questions'
import {
  typeMapping as examTypeMapping,
  enTypeToAr as enExamTypeToAr,
} from '~/utils/exams'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  UseFieldArrayRemove,
  UseFormReturn,
  useForm,
  useWatch,
  useFieldArray,
} from 'react-hook-form'
import { CheckedState } from '@radix-ui/react-checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { Combobox } from '~/components/ui/combobox'
import { getServerAuthSession } from '~/server/auth'
import { useSession } from 'next-auth/react'

type Row = Exam & {
  student: User | null
  corrector: User | null
  questions: {
    id: number
  }[]
  course: Course
  curriculum: Curriculum
  cycle: Cycle
}

type Group = {
  number: number
  gradePerQuestion: number
  difficulty: QuestionDifficulty | string | undefined
  styleOrType: QuestionStyle | QuestionType | string | undefined
}

type FieldValues = {
  type: string
  courseId: string
  trackId: string
  curriculumId: string
  repeatFromSameHadith: CheckedState
  groups: Group[]
  cycleId: string
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

const AddExamDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newSystemExamSchema),
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

  const examCreate = api.exams.createSystem.useMutation()

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const trackId = useWatch({ control: form.control, name: 'trackId' })

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

  const {
    fields: groups,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const { data: cycles, isLoading: isCyclesLoading } =
    api.cycles.findMany.useQuery({})

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

  const onSubmit = (data: FieldValues) => {
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
        queryClient.invalidateQueries([['exams']])
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                  <SelectItem value={ExamType.FULL}>المنهج كامل</SelectItem>
                  <SelectItem value={ExamType.FIRST_MEHWARY}>
                    الإختبار المحوري الأول
                  </SelectItem>
                  <SelectItem value={ExamType.SECOND_MEHWARY}>
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
                      curriculaFetchStatus === 'fetching' && isCurriculaLoading
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
        <Button>بدأ الاختبار</Button>
      </form>
    </Form>
  )
}

const DeleteExamDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const examDelete = api.exams.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteExam = () => {
    const t = toast({ title: 'جاري حذف الإمتحان' })
    examDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الإمتحان بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['exams']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا الإمتحان</AlertDialogTitle>
        <AlertDialogDescription>
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteExam}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

const columnHelper = createColumnHelper<Row>()

const columns = [
  columnHelper.accessor('student.name', {
    header: 'الطالب',
    cell: (info) => info.getValue() || '-',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('student.email', {
    header: 'الإيميل',
    cell: (info) => info.getValue() || '-',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('course.name', {
    id: 'course',
    header: ({ column }) => {
      const { data: courses, isLoading } = api.courses.findMany.useQuery({})
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <div className='flex items-center'>
          المقرر
          <Popover>
            <PopoverTrigger className='mr-4'>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Combobox
                items={[{ name: 'الكل', id: '' }, ...(courses || [])]}
                loading={isLoading}
                labelKey='name'
                valueKey='id'
                onSelect={column.setFilterValue}
                value={filterValue}
                triggerText='الكل'
                triggerClassName='w-full'
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('curriculum.name', {
    id: 'curriculum',
    header: ({ column, table }) => {
      const { data: curricula, isLoading } = api.curricula.findMany.useQuery({
        where: {
          track: {
            courseId:
              table.getState().columnFilters.find((f) => f.id === 'course')
                ?.value || undefined,
          },
        },
      })
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <div className='flex items-center'>
          المنهج
          <Popover>
            <PopoverTrigger className='mr-4'>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Combobox
                items={[{ name: 'الكل', id: '' }, ...(curricula || [])]}
                loading={isLoading}
                labelKey='name'
                valueKey='id'
                onSelect={column.setFilterValue}
                value={filterValue}
                triggerText='الكل'
                triggerClassName='w-full'
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          النوع
          <Popover>
            <PopoverTrigger className='mr-4'>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Select
                value={filterValue === undefined ? '' : filterValue}
                onValueChange={column.setFilterValue}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>الكل</SelectItem>
                  {Object.entries(examTypeMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    cell: ({ getValue }) => enExamTypeToAr(getValue()),
  }),
  // columnHelper.accessor('grade', {
  //   header: 'الدرجة',
  //   cell: (info) => (
  //     <Badge
  //     // variant={info.getValue() !== null ? 'primary' : 'warning'}
  //     >
  //       {info.getValue() === null
  //         ? 'لم يتم التصحيح'
  //         : `${info.getValue()} من ${
  //             info.row.original.questions.length
  //           } (${percentage(
  //             info.getValue() as number,
  //             info.row.original.questions.length
  //           )}%)`}
  //     </Badge>
  //   ),
  //   meta: {
  //     className: 'text-center',
  //   },
  // }),
  columnHelper.accessor('cycle.name', {
    id: 'cycle',
    header: ({ column }) => {
      const { data: tracks, isLoading } = api.cycles.findMany.useQuery({})

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          الدورة
          <Popover>
            <PopoverTrigger className='mr-4'>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Combobox
                items={[{ name: 'الكل', id: '' }, ...(tracks || [])]}
                loading={isLoading}
                labelKey='name'
                valueKey='id'
                onSelect={column.setFilterValue}
                value={filterValue}
                triggerText='الكل'
                triggerClassName='w-full'
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'وقت الإنشاء',
    cell: (info) => formatDate(info.getValue()),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('enteredAt', {
    header: 'وقت البدأ',
    cell: (info) =>
      info.getValue() ? (
        formatDate(info.getValue() as Date)
      ) : (
        <Badge variant='destructive'>لم يتم البدأ</Badge>
      ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('submittedAt', {
    header: 'وقت التسليم',
    cell: (info) =>
      info.getValue() ? (
        formatDate(info.getValue() as Date)
      ) : (
        <Badge variant='destructive'>لم يتم التسليم</Badge>
      ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('correctedAt', {
    header: 'وقت التصحيح',
    cell: (info) =>
      info.getValue() ? (
        formatDate(info.getValue() as Date)
      ) : (
        <Badge variant='destructive'>لم يتم التصحيح</Badge>
      ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('corrector.name', {
    header: 'المصحح',
    cell: (info) => info.getValue() || '-',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => (
      <div className='flex justify-center gap-2'>
        {!!row.original.submittedAt && (
          <Link
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            href={`/dashboard/exams/${row.original.id}`}
          >
            <FileCheck2 className='h-4 w-4 text-success' />
          </Link>
        )}
        <Button
          size='icon'
          variant='ghost'
          onClick={() =>
            navigator.clipboard.writeText(
              `${location.origin}/exams/${row.original.id}`
            )
          }
        >
          <LinkIcon className='h-4 w-4' />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteExamDialog id={row.original.id} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  }),
]

type Props = {
  page: number
}

const PAGE_SIZE = 50

const ExamsPage = () => {
  const router = useRouter()

  const { data: session } = useSession()

  const [dialogOpen, setDialogOpen] = useState(false)

  const pageIndex = z
    .preprocess((v) => Number(v), z.number().positive().int())
    .safeParse(router.query.page).success
    ? Number(router.query.page) - 1
    : 0

  const pageSize = PAGE_SIZE

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    // {
    //   id: 'difficulty',
    //   value: '',
    // },
    // {
    //   id: 'grade',
    //   value: '',
    // },
    // {
    //   id: 'graded',
    //   value: '',
    // },
    {
      id: 'type',
      value: ExamType.FULL,
    },
  ])
  const filters = columnFilters.map((filter) => {
    if (filter.id === 'cycle')
      return { cycleId: { equals: filter.value as string } }
    else if (filter.id === 'course')
      return { courseId: { equals: filter.value as string } }
    else if (filter.id === 'curriculum')
      return { curriculumId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: exams, isFetching } = api.exams.findMany.useQuery<any, Row[]>(
    {
      skip: pageIndex * pageSize,
      take: pageSize,
      include: {
        student: true,
        curriculum: true,
        course: true,
        corrector: true,
        cycle: true,
      },
      where: { AND: filters },
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.exams.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    exams !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: exams || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Head>
        <title>الإختبارات</title>
      </Head>
      <div>
        <div className='mb-2 flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>الإختبارات</h2>
          {session!.user.role === UserRole.ADMIN && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button>إضافة إختبار نظام</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>إضافة إختبار نظام</DialogHeader>
                <AddExamDialog setDialogOpen={setDialogOpen} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <DataTable table={table} fetching={isFetching} />
      </div>
    </>
  )
}

ExamsPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (
    session?.user.role !== UserRole.ADMIN &&
    session?.user.role !== UserRole.CORRECTOR
  )
    return { notFound: true }

  return {
    props: {
      session,
    },
  }
}
export default ExamsPage
