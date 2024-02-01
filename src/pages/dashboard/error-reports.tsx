import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TrashIcon, EyeIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
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
import { Button, buttonVariants } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { toast } from 'sonner'
import { api } from '~/utils/api'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { Checkbox } from '~/components/ui/checkbox'
import { deleteRows } from '~/utils/client/deleteRows'
import { DataTableActions } from '~/components/ui/data-table-actions'

const DeleteErrorReportDialog = ({ id }: { id: string }) => {
  const deleteMutation = api.errorReport.delete.useMutation()
  const utils = api.useUtils()

  const deleteErrorReport = () => {
    const promise = deleteMutation.mutateAsync(id).finally(() => {
      utils.errorReport.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف البلاغ...',
      success: 'تم حذف البلاغ بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا البلاغ؟</AlertDialogTitle>
        <AlertDialogDescription>
          {/* هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً */}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteErrorReport}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

const columnHelper = createColumnHelper<any>()

const PAGE_SIZE = 25

const ErrorReportsPage = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const [rowSelection, setRowSelection] = useState({})

  const pageIndex = z
    .preprocess((v) => Number(v), z.number().positive().int())
    .safeParse(router.query.page).success
    ? Number(router.query.page) - 1
    : 0

  const pageSize = PAGE_SIZE

  const pagination: PaginationState = { pageIndex, pageSize }

  const bulkDeleteMutation = api.errorReport.bulkDelete.useMutation()
  const deleteAllMutation = api.errorReport.deleteAll.useMutation()

  const invalidate = utils.errorReport.invalidate

  const { data: errorReports, isFetching: isFetchingErrorReports } =
    api.errorReport.list.useQuery(
      { pagination, include: { question: true } },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.errorReport.count.useQuery(undefined, { networkMode: 'always' })

  const pageCount =
    errorReports !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

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
        header: 'اسم المبلغ',
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('email', {
        header: 'البريد الإلكتروني',
        meta: {
          textAlign: 'center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('questionNumber', {
        header: 'رقم السؤال',
        meta: {
          textAlign: 'center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('questionPartNumber', {
        header: 'رقم الجزء',
        meta: {
          textAlign: 'center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('questionPageNumber', {
        header: 'رقم الصفحة',
        meta: {
          textAlign: 'center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('note', {
        header: 'الملاحظة',
        meta: {
          textAlign: 'center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <Link
              href={`/dashboard/questions?id=${row.original.questionId}`}
              className={cn(
                buttonVariants({ size: 'icon', variant: 'ghost' }),
                'hover:bg-blue-100'
              )}
            >
              <EyeIcon className='h-4 w-4 text-blue-600' />
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-red-100'
                >
                  <TrashIcon className='h-4 w-4 text-red-600' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteErrorReportDialog
                  id={row.original.id as unknown as string}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
        meta: {
          textAlign: 'center',
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: (errorReports as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
        <title>تبليغات الأخطاء</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>تبليغات الأخطاء</h2>
      </div>
      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: !errorReports || errorReports?.length === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={isFetchingErrorReports} />
    </>
  )
}

ErrorReportsPage.getLayout = (page: any) => (
  <DashboardLayout>{page} </DashboardLayout>
)

export default ErrorReportsPage
