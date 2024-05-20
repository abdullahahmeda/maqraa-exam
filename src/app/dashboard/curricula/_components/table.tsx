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
import type { Course, Track, Curriculum } from '~/kysely/types'
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
import { Combobox } from '~/components/ui/combobox'

type Row = Selectable<Curriculum> & {
  track: Track & { course: Course }
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()

  const utils = api.useUtils()

  const [open, setOpen] = useState(false)

  const mutation = api.curriculum.delete.useMutation()

  useEffect(() => {
    router.prefetch(`/dashboard/curricula/edit/${row.original.id}`)
  }, [router, row.original.id])

  const deleteCurriculum = (id: string) => {
    const promise = mutation.mutateAsync(id)

    void promise.then(() => {
      void utils.curriculum.list.invalidate()
    })

    toast.promise(promise, {
      loading: 'جاري حذف المنهج...',
      success: 'تم حذف المنهج بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف المنهج',
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
            router.push(`/dashboard/curricula/edit/${row.original.id}`),
        }}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا المنهج وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCurriculum(row.original.id)}
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
        aria-label='اختر الكل'
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
          label='المنهج'
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
    accessorFn: (row) => `${row.track.course.name}: ${row.track.name}`,
    id: 'trackId',
    header: ({ column }) => {
      const { data: tracks, isLoading } = api.track.list.useQuery({
        include: { course: true },
      })

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='المقرر'
          filter={
            <Combobox
              items={[
                { name: 'الكل', id: '' },
                ...(tracks?.data.map((t) => ({
                  ...t,
                  name: `${t.course?.name}: ${t.name}`,
                })) ?? []),
              ]}
              loading={isLoading}
              labelKey='name'
              valueKey='id'
              onSelect={column.setFilterValue}
              value={filterValue}
              triggerText='الكل'
              triggerClassName='w-full'
            />
          }
          column={column}
        />
      )
    },
    filterFn: () => true,
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
  },
]

export const CurriculaTable = ({
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

  const invalidate = () => utils.curriculum.invalidate()

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }
  const bulkDeleteMutation = api.curriculum.bulkDelete.useMutation()
  const deleteAllMutation = api.curriculum.deleteAll.useMutation()

  const filters = columnFilters.reduce(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  )

  const { data: curricula, isFetching } = api.curriculum.list.useQuery(
    { pagination, filters, include: { track: { course: true } } },
    { initialData, refetchOnMount: false },
  )

  useEffect(() => {
    setPagination(({ pageSize }) => ({
      pageIndex: 0,
      pageSize,
    }))
  }, [columnFilters])

  const pageCount = Math.ceil(curricula.count / pagination.pageSize)

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
            data: { disabled: curricula?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={curricula.data}
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
