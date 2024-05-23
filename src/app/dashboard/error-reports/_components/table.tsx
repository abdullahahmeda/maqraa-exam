'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type {
  ColumnFiltersState,
  ColumnDef,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table'
import { DataTable } from '~/components/ui/data-table'
import { RowActions } from '~/components/ui/row-actions'
import type { ErrorReport, ModelQuestion, Question, User } from '~/kysely/types'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Spinner } from '~/components/ui/spinner'
import { type TRPCError } from '@trpc/server'
// import { ExportCollectionTypesButton } from './export-button'
import { Checkbox } from '~/components/ui/checkbox'
import type { Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { deleteRows } from '~/utils/client/deleteRows'
import { Badge } from '~/components/ui/badge'
import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'

type Row = Selectable<ErrorReport> & {
  modelQuestion:
    | (Selectable<ModelQuestion> & { question: Selectable<Question> | null })
    | null
  user: Selectable<User> | null
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const utils = api.useUtils()

  const [open, setOpen] = useState(false)

  const mutation = api.errorReport.delete.useMutation()

  // useEffect(() => {
  //   router.prefetch(`/dashboard/error-reports/edit/${row.original.id}`)
  // }, [router, row.original.id])

  const deleteErrorReport = (id: string) => {
    const promise = mutation.mutateAsync(id)

    void promise.then(() => {
      void utils.errorReport.list.invalidate()
    })

    toast.promise(promise, {
      loading: 'جاري حذف البلاغ...',
      success: 'تم حذف البلاغ بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف البلاغ',
    })
  }

  return (
    <>
      <RowActions
        deleteButton={{
          onClick: () => setOpen(true),
        }}
        // editButton={{
        //   onClick: () =>
        //     router.push(`/dashboard/error-reports/edit/${row.original.id}`),
        // }}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا البلاغ وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteErrorReport(row.original.id)}
            >
              {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const columns: ColumnDef<Row>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='اختر الصف'
      />
    ),
  },
  {
    accessorFn: (row) => (row.user ? row.user.name : row.name),
    header: 'اسم المبلغ',
    meta: {
      textAlign: 'center',
    },
  },
  {
    header: 'البريد الإلكتروني',
    accessorFn: (row) => (row.user ? row.user.email : row.email),
    meta: {
      textAlign: 'center',
    },
  },
  {
    id: 'userType',
    header: 'نوع المبلغ',
    meta: {
      textAlign: 'center',
    },
    cell: ({ row }) =>
      row.original.user ? (
        <Badge>عضو</Badge>
      ) : (
        <Badge variant='outline'>زائر</Badge>
      ),
  },
  {
    id: 'questionText',
    header: 'السؤال',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/questions/${row.original.modelQuestion?.question?.id}`}
        className={buttonVariants({ variant: 'link' })}
      >
        عرض السؤال
      </Link>
    ),
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'note',
    header: 'البلاغ',
    meta: {
      textAlign: 'center',
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
  },
]

export const ErrorReportsTable = ({
  initialData,
}: {
  initialData: { data: Row[]; count: number }
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams?.get('page')
  const utils = api.useUtils()

  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pagination: PaginationState = {
    pageIndex: Math.max((Number(page) || 1) - 1, 0),
    pageSize: 50,
  }

  const invalidate = () => utils.errorReport.invalidate()

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }
  const bulkDeleteMutation = api.errorReport.bulkDelete.useMutation()
  const deleteAllMutation = api.errorReport.deleteAll.useMutation()

  const { data: errorReports, isFetching } = api.errorReport.list.useQuery(
    {
      pagination,
      include: {
        user: true,
        modelQuestion: {
          question: true,
        },
      },
    },
    { initialData, refetchOnMount: false },
  )

  const pageCount = Math.ceil(errorReports.count / pagination.pageSize)

  const selectedRows = Object.keys(rowSelection)

  const handleBulkDelete = () => {
    deleteRows({
      mutateAsync: () => bulkDeleteMutation.mutateAsync(selectedRows),
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
      <div className='flex gap-2'>
        <DataTableActions
          deleteAll={{
            handle: handleDeleteAll,
            data: { disabled: errorReports?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={errorReports.data}
        // @ts-expect-error TODO: check this
        columns={columns}
        columnFilters={{
          onColumnFiltersChange: setColumnFilters,
          state: columnFilters,
        }}
        pagination={{
          pageCount,
          onPaginationChange: setPagination,
          state: pagination,
        }}
        isFetching={isFetching}
        rowSelection={{
          state: rowSelection,
          onRowSelectionChange: setRowSelection,
        }}
        rowId='id'
      />
    </>
  )
}
