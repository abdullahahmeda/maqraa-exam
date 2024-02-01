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
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import { NewQuestionStyleDialog } from '~/components/modals/new-question-style'
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
} from '~/components/ui/alert-dialog'
import { DeleteQuestionStyleDialog } from '~/components/modals/delete-question-style'
import { enColumnToAr, enTypeToAr } from '~/utils/questions'
import { Badge } from '~/components/ui/badge'
import { deleteRows } from '~/utils/client/deleteRows'
import { Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'

const columnHelper = createColumnHelper<Selectable<QuestionStyle>>()

const PAGE_SIZE = 25

const QuestionsStylesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()
  const utils = api.useUtils()

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
                  <PencilIcon className='h-4 w-4 text-orange-500' />
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
                  <TrashIcon className='h-4 w-4 text-red-600' />
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

  const bulkDeleteMutation = api.questionStyle.bulkDelete.useMutation()
  const deleteAllMutation = api.questionStyle.deleteAll.useMutation()

  const invalidate = utils.questionStyle.invalidate

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
    deleteRows({
      mutateAsync: () =>
        bulkDeleteMutation.mutateAsync(selectedRows.map((r) => r.id)),
      invalidate,
      setRowSelection,
    })
  }

  const handleDeleteAll = () => {
    deleteRows({
      mutateAsync: deleteAllMutation.mutateAsync,
      invalidate,
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
              <PlusIcon className='h-4 w-4' />
              إضافة نوع سؤال
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewQuestionStyleDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: !questionStyles || questionStyles?.length === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={fetchingQuestionStyles} />
    </>
  )
}

QuestionsStylesPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default QuestionsStylesPage
