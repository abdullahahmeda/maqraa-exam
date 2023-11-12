import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { Dialog, DialogTrigger, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { Plus, Trash, Pencil } from 'lucide-react'
import { AddQuestionStyleDialog } from '~/components/modals/add-question-style'
import { EditQuestionStyleDialog } from '~/components/modals/edit-question-style'
import type { QuestionStyle } from '~/kysely/types'
import { api } from '~/utils/api'
import { z } from 'zod'
import { DataTable } from '~/components/ui/data-table'
import { useRouter } from 'next/router'
import { Checkbox } from '~/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
} from '~/components/ui/alert-dialog'
import { DeleteQuestionStyleDialog } from '~/components/modals/delete-question-style'
import { enColumnToAr, enTypeToAr } from '~/utils/questions'
import { Badge } from '~/components/ui/badge'
import { useToast } from '~/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

const columnHelper = createColumnHelper<QuestionStyle>()

const PAGE_SIZE = 25

const QuestionsStylesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

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

  const columns = useMemo(
    () => [
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
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      columnHelper.accessor('name', {
        header: 'الاسم',
      }),
      columnHelper.accessor('type', {
        header: 'نوع السؤال',
        cell: ({ getValue }) => <Badge>{enTypeToAr(getValue())}</Badge>,
      }),
      columnHelper.accessor('choicesColumns', {
        header: 'حقول الإختيارات',
        cell: ({ getValue }) =>
          getValue()
            ?.map((c) => enColumnToAr(c))
            .join('، '),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-orange-50'
                >
                  <Pencil className='h-4 w-4 text-orange-500' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <EditQuestionStyleDialog
                  id={row.original.id as unknown as string}
                  setDialogOpen={setDialogOpen}
                />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='icon' variant='ghost' className='hover:bg-red-50'>
                  <Trash className='h-4 w-4 text-red-600' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteQuestionStyleDialog
                  id={row.original.id as unknown as string}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      }),
    ],
    []
  )

  const {
    data: questionStyles,
    isFetching: fetchingQuestionStyles,
    error,
  } = api.questionStyle.list.useQuery({ pagination })

  const bulkDelete = api.questionStyle.bulkDelete.useMutation()

  const { data: count, isLoading: isCountLoading } =
    api.questionStyle.count.useQuery(undefined, { networkMode: 'always' })

  const pageCount =
    questionStyles !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    columns,
    data: (questionStyles as any[]) ?? [],
    getCoreRowModel: getCoreRowModel(),
    state: { pagination, rowSelection },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
  })

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((item) => item.original)

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    const t = toast({ title: 'جاري حذف أنواع الأسئلة المختارة...' })
    bulkDelete
      .mutateAsync(selectedRows.map(({ id }) => id) as unknown as string[])
      .then(() => {
        toast({ title: 'تم الحذف بنجاح' })
        setRowSelection({})
      })
      .catch((e) => {
        toast({ title: 'حدث خطأ أثناء الحذف' })
      })
      .finally(() => {
        t.dismiss()
        queryClient.invalidateQueries([['questionStyle']])
      })
  }
  return (
    <>
      <Head>
        <title>أنواع الأسئلة</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>أنواع الأسئلة</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة نوع سؤال
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddQuestionStyleDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
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
              {selectedRows.length > 0 && `(${selectedRows.length} من العناصر)`}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                هل تريد حقاً حذف أنواع الأسئلة المختارة؟
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              سيتم حذف {selectedRows.length} من أنواع الأسئلة
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
      <DataTable table={table} fetching={fetchingQuestionStyles} />
    </>
  )
}

QuestionsStylesPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default QuestionsStylesPage
