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
import type { Curriculum, CycleCurriculum, Cycle } from '~/kysely/types'
import { useCallback, useEffect, useState } from 'react'
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
import { FilterHeader } from '~/components/ui/filter-header'
import { Input } from '~/components/ui/input'
import debounce from 'lodash.debounce'
import { type Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { deleteRows } from '~/utils/client/deleteRows'

type Row = { id: string; name: string; cycleCurricula: { curriculumName: string; curriculumId: string }[] }

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()

  const utils = api.useUtils()

  const [open, setOpen] = useState(false)

  const mutation = api.cycle.delete.useMutation()

  useEffect(() => {
    router.prefetch(`/dashboard/cycles/edit/${row.original.id}`)
  }, [router, row.original.id])

  const deleteCycle = (id: string) => {
    const promise = mutation.mutateAsync(id)

    toast.promise(promise, {
      loading: 'جاري حذف الدورة...',
      success: 'تم حذف الدورة بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف الدورة',
    })
  }

  return (
    <>
      <RowActions
        deleteButton={{
          onClick: () => setOpen(true),
        }}
        editButton={{
          onClick: () =>
            router.push(`/dashboard/cycles/edit/${row.original.id}`),
        }}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف الدورة هذه وكل ما يتعلق بها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCycle(row.original.id)}>
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
    accessorKey: 'name',
    header: function Header({ column }) {
      const [value, setValue] = useState(
        (column.getFilterValue() as string) ?? '',
      )

      const debouncedChangeColumnValue = useCallback(
        debounce((value: string) => column.setFilterValue(value), 500),
        [],
      )

      return (
        <FilterHeader
          label='الاسم'
          filter={
            <Input
              placeholder='الاسم'
              onChange={(e) => {
                const value = e.target.value
                setValue(value)
                debouncedChangeColumnValue(value)
              }}
              value={value}
            />
          }
          column={column}
        />
      )
    },
  },
  {
    accessorFn: (row) =>
      row.cycleCurricula?.map((c) => c.curriculumName).join('، '),
    id: 'cycleCurricula.curriculumId',
    header: 'المناهج',
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
  },
]

export const CyclesTable = ({
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

  const invalidate = () => utils.cycle.invalidate()

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }
  const bulkDeleteMutation = api.cycle.bulkDelete.useMutation()
  const deleteAllMutation = api.cycle.deleteAll.useMutation()

  const filters = columnFilters.reduce(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  )

  const { data: cycles, isFetching } = api.cycle.getListForTable.useQuery(
    { pagination, filters },
    { initialData, refetchOnMount: false },
  )

  useEffect(() => {
    setPagination(({ pageSize }) => ({
      pageIndex: 0,
      pageSize,
    }))
  }, [columnFilters])

  const pageCount = Math.ceil(cycles.count / pagination.pageSize)

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
            data: { disabled: cycles?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={cycles.data}
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
