import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Question } from '@prisma/client'
import {
  ColumnFiltersState,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Download, Eye, Filter, Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { AddQuestionsDialog } from '~/components/modals/add-questions'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Combobox } from '~/components/ui/combobox'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'
import { api } from '~/utils/api'
import {
  difficultyMapping,
  enDifficultyToAr,
  enStyleToAr,
  enTypeToAr,
  styleMapping,
  typeMapping,
} from '~/utils/questions'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogCancel,
} from '~/components/ui/alert-dialog'
import { DeleteQuestionDialog } from '~/components/modals/delete-question'
import { saveAs } from 'file-saver'
import { Input } from '~/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'

const columnHelper = createColumnHelper<
  Question & { course: { name: string } }
>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? table.getIsAllPageRowsSelected()
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
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
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <div className='flex items-center'>
          رقم السؤال
          <Popover>
            <PopoverTrigger className='mr-4' asChild>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Input
                type='text'
                value={filterValue === undefined ? '' : filterValue}
                onChange={(e) => column.setFilterValue(e.target.value)}
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
      const { data: courses, isLoading } = api.course.findMany.useQuery({})

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          المقرر
          <Popover>
            <PopoverTrigger className='mr-4' asChild>
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
            <PopoverTrigger className='mr-4' asChild>
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
            <PopoverTrigger className='mr-4' asChild>
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
            <PopoverTrigger className='mr-4' asChild>
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
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size='icon' variant='ghost' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteQuestionDialog id={row.original.id} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const QuestionsPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
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
    else if (
      filter.id === 'number' &&
      typeof filter.value === 'string' &&
      filter.value.length > 0
    )
      return { number: parseInt(filter.value) }

    return { [filter.id]: { equals: filter.value } }
  })

  const bulkQuestionsDelete = api.deleteBulkQuestions.useMutation()

  const { data: questions, isFetching: isFetchingQuestions } =
    api.question.findMany.useQuery(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        include: { course: true },
        where: { AND: filters },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.question.count.useQuery(
      { where: { AND: filters } },
      { networkMode: 'always' }
    )

  const questionsExport = api.exportQuestions.useMutation()

  const pageCount =
    questions !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: questions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { pagination, columnFilters, rowSelection },
    pageCount,
    manualPagination: true,
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    onRowSelectionChange: setRowSelection,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
  })

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((item) => item.original)

  const handleDownload = async () => {
    const t = toast({ title: 'يتم تجهيز الملف للتحميل...' })
    questionsExport
      .mutateAsync()
      .then((arrayBuffer) => {
        const content = new Blob([arrayBuffer])
        saveAs(content, 'قاعدة بيانات الأسئلة.xlsx')
        toast({ title: 'تم بدأ تحميل الملف' })
      })
      .catch((e) => {
        toast({ title: 'حدث خطأ أثناء تحميل الملف' })
      })
      .finally(() => {
        t.dismiss()
      })
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    const t = toast({ title: 'جاري حذف الأسئلة المختارة...' })
    bulkQuestionsDelete
      .mutateAsync(selectedRows.map(({ id }) => id))
      .then(() => {
        toast({ title: 'تم الحذف بنجاح' })
        setRowSelection({})
      })
      .catch((e) => {
        toast({ title: 'حدث خطأ أثناء الحذف' })
      })
      .finally(() => {
        t.dismiss()
        queryClient.invalidateQueries([['question']])
      })
  }

  return (
    <>
      <Head>
        <title>الأسئلة</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>الأسئلة</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة أسئلة
            </Button>
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
          className='mb-4 flex gap-2'
          onClick={handleDownload}
        >
          <Download className='h-4 w-4' />
          تصدير الكل
        </Button>
        <div className='mb-4'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                className='flex items-center gap-2'
                // onClick={handleBulkDelete}
                disabled={selectedRows.length === 0}
              >
                <Trash size={16} />
                حذف{' '}
                {selectedRows.length > 0 &&
                  `(${selectedRows.length} من العناصر)`}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  هل تريد حقاً حذف الأسئلة المختارة؟
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                سيتم حذف {selectedRows.length} من الأسئلة
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleBulkDelete}>
                  تأكيد
                </AlertDialogAction>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <DataTable table={table} fetching={isFetchingQuestions} />
      </div>
    </>
  )
}

QuestionsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default QuestionsPage
