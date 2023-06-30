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
import toast from 'react-hot-toast'
import { Question } from '@prisma/client'
import Spinner from '~/components/spinner'
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
import Pagination from '../../components/pagination'
import { customErrorMap } from '../../validation/customErrorMap'
import DashboardTable from '../../components/dashboard/table'
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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { DataTable } from '~/components/ui/data-table'
import { Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command'
import { cn } from '~/lib/utils'
import fuzzysort from 'fuzzysort'

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
  // open,
  // setOpen,
  refetchQuestions,
}: {
  // open: boolean
  // setOpen: any
  refetchQuestions: any
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
    api.courses.findMany.useQuery()

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
        // closeModal()
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
                  defaultValue={field.value}
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
                <Select
                  disabled={!courses || courses.length === 0}
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
  // columnHelper.accessor('id', {
  //   header: 'ID',
  //   meta: {
  //     className: 'text-center',
  //   },
  // }),
  // columnHelper.accessor('number', {
  //   header: 'رقم السؤال',
  //   meta: {
  //     className: 'text-center'
  //   }
  // }),
  columnHelper.accessor('text', {
    header: 'السؤال',
  }),
  columnHelper.accessor('course.name', {
    id: 'course',
    header: ({ column }) => {
      const [open, setOpen] = useState(false)
      const columnFilterValue = column.getFilterValue()
      const [searchValue, setSearchValue] = useState('')

      const { data: _courses, isLoading } = api.courses.findMany.useQuery()

      const onSelect = (currentValue: string | undefined) => {
        column.setFilterValue(
          currentValue
          // currentValue === columnFilterValue ? '' : currentValue
        )
        setOpen(false)
      }

      const courses = searchValue
        ? fuzzysort
            .go(searchValue, _courses || [], {
              key: 'name',
            })
            .map((item) => item.obj)
        : _courses

      return (
        <>
          المقرر
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-[200px] justify-between'
                  disabled={isLoading}
                >
                  {columnFilterValue
                    ? courses?.find((course) => course.id === columnFilterValue)
                        ?.name
                    : 'الكل'}
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
                  ) : (
                    <ChevronsUpDown className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='ابحث عن المقرر...'
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>لا يوجد مقررات.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => onSelect(undefined)}>
                      الكل
                      <Check
                        className={cn(
                          'mr-auto h-4 w-4',
                          columnFilterValue === undefined
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                    {courses?.map((course) => (
                      <CommandItem
                        value={course.id}
                        key={course.id}
                        onSelect={onSelect}
                      >
                        {course.name}
                        <Check
                          className={cn(
                            'mr-auto h-4 w-4',
                            columnFilterValue === course.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )
    },
    meta: {
      className: 'text-center min-w-[150px]',
    },
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => {
      return (
        <>
          النوع
          <Select defaultValue='' onValueChange={column.setFilterValue}>
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
        </>
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
      return (
        <>
          الأسلوب
          <Select defaultValue='' onValueChange={column.setFilterValue}>
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
        </>
      )
    },
    cell: (info) => <Badge>{enStyleToAr(info.getValue())}</Badge>,
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('difficulty', {
    header: ({ column }) => (
      <>
        الأسلوب
        <Select defaultValue='' onValueChange={column.setFilterValue}>
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
      </>
    ),
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
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <div className='flex justify-center'>
        {/* <Button>عرض</Button> */}
        <Button size='icon' variant='ghost'>
          <Eye height={22} width={22} />
        </Button>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const QuestionsPage = ({ page: initialPage }: Props) => {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE,
    }),
    [pageIndex, pageSize]
  )

  const filters = columnFilters.map((filter) => {
    if (filter.id === 'course')
      return { courseId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const {
    data: questions,
    isFetching: isFetchingQuestions,
    refetch: refetchQuestions,
  } = api.questions.findMany.useQuery<
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

  const pageCount =
    questions !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: questions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, columnFilters },
    manualFiltering: true,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  })

  useEffect(() => {
    router.query.page = `${pageIndex + 1}`
    router.push(router)
  }, [pageIndex])

  useEffect(() => {
    setPagination((pagination) => ({
      ...pagination,
      pageIndex: Number(router.query.page) - 1,
    }))
  }, [router.query.page])

  return (
    <>
      <Head>
        <title>الأسئلة</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>الأسئلة</h2>
        <Dialog>
          <DialogTrigger>
            <Button>إضافة أسئلة</Button>
          </DialogTrigger>
          <DialogContent>
            <AddQuestionsDialog refetchQuestions={refetchQuestions} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable table={table} fetching={isFetchingQuestions} />
    </>
  )
}

QuestionsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default QuestionsPage
