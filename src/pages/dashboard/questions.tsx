import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import { api } from '~/utils/api'
import {
  difficultyMapping,
  enDifficultyToAr,
  enStyleToAr,
  enTypeToAr,
  getDifficultyVariant,
  styleMapping,
  typeMapping,
} from '~/utils/questions'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Question } from '@prisma/client'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { QuestionDifficulty, QuestionType } from '../../constants'
import { customErrorMap } from '../../validation/customErrorMap'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Checkbox } from '~/components/ui/checkbox'
import { Badge } from '~/components/ui/badge'
import { DataTable } from '~/components/ui/data-table'
import { Download, Eye, Filter } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'
import { Combobox } from '~/components/ui/combobox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

type FieldValues = {
  url: string
  sheet: string
  course: undefined | string
  removeOldQuestions: boolean
}

const defaultValues: FieldValues = {
  url: '',
  sheet: '',
  course: undefined,
  removeOldQuestions: false,
}

const AddQuestionsDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(importQuestionsSchema, {
      errorMap: customErrorMap,
    }),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const questionsImport = api.questions.import.useMutation()

  const {
    isFetching: isFetchingSheets,
    data: sheets,
    refetch: refetchSheets,
  } = api.sheets.listSheets.useQuery(
    {
      url: form.getValues('url'),
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      onError: (error) => {
        form.setError('url', {
          message: error.message,
        })
      },
    }
  )

  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.findMany.useQuery({})

  const updateSpreadsheet = async () => {
    const isValidUrl = await form.trigger('url')
    if (!isValidUrl) return

    refetchSheets()
  }

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري إضافة الأسئلة' })
    questionsImport
      .mutateAsync(data as z.infer<typeof importQuestionsSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة الأسئلة بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['questions']])
      })
  }

  return (
    <>
      <DialogHeader>إضافة أسئلة</DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormLabel>رابط الإكسل الشيت</FormLabel>
                <FormControl>
                  <div className='flex gap-1.5'>
                    <Input {...field} />
                    <Button
                      type='button'
                      onClick={updateSpreadsheet}
                      disabled={isFetchingSheets}
                      loading={isFetchingSheets}
                    >
                      تحديث
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sheet'
            render={({ field }) => (
              <FormItem>
                <FormLabel>الورقة</FormLabel>
                <Select
                  disabled={!sheets || sheets.length === 0}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='اختر الورقة' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sheets?.map((sheet) => (
                      <SelectItem key={sheet} value={sheet}>
                        {sheet}
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
          <DialogFooter>
            <Button
              type='submit'
              // variant='success'
              loading={questionsImport.isLoading}
            >
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<
  Question & { course: { name: string } }
>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='تحديد الكل'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='تحديد الصف'
      />
    ),
  }),
  columnHelper.accessor('number', {
    header: 'رقم السؤال',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('pageNumber', {
    header: 'رقم الصفحة',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('partNumber', {
    header: 'رقم الجزء',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('hadithNumber', {
    header: 'رقم الحديث',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('text', {
    header: 'السؤال',
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
      className: 'text-center min-w-[150px]',
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
                  {Object.entries(typeMapping).map(([label, value]) => (
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
    cell: (info) => (
      <Badge
      // variant={info.getValue() === QuestionType.MCQ ? 'success' : 'warning'}
      >
        {enTypeToAr(info.getValue())}
      </Badge>
    ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('style', {
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <div className='flex items-center'>
          الأسلوب
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
                  {Object.entries(styleMapping).map(([label, value]) => (
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
    cell: (info) => <Badge>{enStyleToAr(info.getValue())}</Badge>,
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('difficulty', {
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <div className='flex items-center'>
          المستوى
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
                  {Object.entries(difficultyMapping).map(([label, value]) => (
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
    cell: (info) => (
      <Badge
      // variant={getDifficultyVariant(info.getValue() as QuestionDifficulty)}
      >
        {enDifficultyToAr(info.getValue())}
      </Badge>
    ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('answer', {
    header: 'الإجابة',
    meta: {
      className: 'min-w-[300px]',
    },
  }),
  columnHelper.accessor('anotherAnswer', {
    header: 'إجابة أخرى',
  }),
  columnHelper.accessor('isInsideShaded', {
    header: 'داخل المظلل',
    cell: (info) => (info.getValue() ? 'نعم' : 'لا'),
  }),
  columnHelper.accessor('objective', {
    header: 'يستهدف السؤال',
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <div className='flex justify-center'>
        {/* <Button>عرض</Button> */}
        <Button size='icon' variant='ghost'>
          <Eye className='h-4 w-4' />
        </Button>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const QuestionsPage = () => {
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(false)

  const { toast } = useToast()

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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const filters = columnFilters.map((filter) => {
    if (filter.id === 'course')
      return { courseId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: questions, isFetching: isFetchingQuestions } =
    api.questions.findMany.useQuery<
      any,
      (Question & { course: { name: string } })[]
    >(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        include: { course: true },
        where: { AND: filters },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.questions.count.useQuery(
      { where: { AND: filters } },
      { networkMode: 'always' }
    )

  const questionsExport = api.questions.export.useMutation()

  const pageCount =
    questions !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: questions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { pagination, columnFilters },
    pageCount,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
  })

  const handleDownload = async () => {
    const t = toast({ title: 'يتم تجهيز الملف للتحميل...' })
    const XLSX = await import('xlsx')
    questionsExport
      .mutateAsync()
      .then(async (workbook) => {
        XLSX.writeFile(workbook, 'قاعدة بيانات الأسئلة.xlsx')
        toast({ title: 'تم بدأ تحميل الملف' })
      })
      .catch(() => {
        toast({ title: 'حدث خطأ أثناء تحميل الملف' })
      })
      .finally(() => {
        t.dismiss()
      })
  }

  return (
    <>
      <Head>
        <title>الأسئلة</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>الأسئلة</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>إضافة أسئلة</Button>
          </DialogTrigger>
          <DialogContent>
            <AddQuestionsDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Button
          disabled={!questions || questions.length === 0}
          variant='success'
          className='mb-2 flex gap-2'
          onClick={handleDownload}
        >
          <Download className='h-4 w-4' />
          تصدير
        </Button>
        <DataTable table={table} fetching={isFetchingQuestions} />
      </div>
    </>
  )
}

QuestionsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default QuestionsPage
