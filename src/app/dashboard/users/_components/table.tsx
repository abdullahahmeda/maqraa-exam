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
import type { User, UserCycle, Cycle } from '~/kysely/types'
import { useCallback, useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { Checkbox } from '~/components/ui/checkbox'
import { FilterHeader } from '~/components/ui/filter-header'
import { Input } from '~/components/ui/input'
import debounce from 'lodash.debounce'
import { type Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { deleteRows } from '~/utils/client/deleteRows'
import { Combobox } from '~/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { enUserRoleToAr, userRoleMapping } from '~/utils/users'
import { Badge } from '~/components/ui/badge'
import set from 'lodash.set'
import { useSession } from 'next-auth/react'
import { useViewModal } from './view-modal'
import { useDeleteModal } from './delete-modal'

type Row = Selectable<User> & {
  cycles: (Selectable<UserCycle> & { cycle: Selectable<Cycle> | null })[]
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { setUserId: openViewUserModal } = useViewModal()
  const { setUserId: openDeleteUserModal } = useDeleteModal()

  const canEditOrDelete =
    session?.user?.role === 'SUPER_ADMIN' ||
    (row.original.role !== 'SUPER_ADMIN' && session?.user?.role === 'ADMIN')

  useEffect(() => {
    router.prefetch(`/dashboard/users/edit/${row.original.id}`)
  }, [router, row.original.id])

  return (
    <>
      <RowActions
        infoButton={{
          onClick: () => openViewUserModal(row.original.id),
        }}
        deleteButton={{
          onClick: () => openDeleteUserModal(row.original.id),
          className: canEditOrDelete ? 'hover:bg-red-100' : 'hidden',
        }}
        editButton={{
          onClick: () =>
            router.push(`/dashboard/users/edit/${row.original.id}`),
          className: canEditOrDelete ? 'hover:bg-orange-100' : 'hidden',
        }}
      />
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
    accessorKey: 'email',
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
          label='البريد الإلكتروني'
          filter={
            <Input
              placeholder='البريد الإلكتروني'
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
    accessorKey: 'role',
    header: function Header({ column }) {
      return (
        <FilterHeader
          label='الصلاحيات'
          filter={
            <Select
              value={(column.getFilterValue() as string | undefined) ?? ''}
              onValueChange={(value) => {
                if (value === 'all') column.setFilterValue('')
                else column.setFilterValue(value)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>الكل</SelectItem>
                {Object.entries(userRoleMapping).map(([label, value]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          column={column}
        />
      )
    },
    filterFn: () => true,
    cell: ({ row }) => <Badge>{enUserRoleToAr(row.original.role)}</Badge>,
  },
  {
    accessorFn: (row) => row.cycles?.map((c) => c.cycle?.name).join('، '),
    id: 'userCycle.cycleId',
    header: ({ column }) => {
      const { data: cycles, isLoading } = api.cycle.getList.useQuery()

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='الدورات'
          filter={
            <Combobox
              items={[{ name: 'الكل', id: '' }, ...(cycles ?? [])]}
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

export const UsersTable = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams?.get('page')

  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pagination: PaginationState = {
    pageIndex: Math.max((Number(page) || 1) - 1, 0),
    pageSize: 50,
  }

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }
  const bulkDeleteMutation = api.user.bulkDelete.useMutation()
  const deleteAllMutation = api.user.deleteAll.useMutation()

  const filters = columnFilters.reduce((acc, { id, value }) => {
    return set(acc, id, value)
  }, {})

  const {
    data: users,
    isPending,
    isError,
    isFetching,
  } = api.user.getTableList.useQuery(
    { pagination, filters },
    { refetchOnMount: false },
  )

  if (isPending) {
    return <DataTable data={[]} columns={columns} isFetching rowId='id' />
  }
  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء التحميل</p>
  }

  const pageCount = Math.ceil(users.count / pagination.pageSize)

  const selectedRows = Object.keys(rowSelection)

  const handleBulkDelete = () => {
    deleteRows({
      mutateAsync: () => bulkDeleteMutation.mutateAsync(selectedRows),
      setRowSelection,
    })
  }

  const handleDeleteAll = () => {
    deleteRows({
      mutateAsync: deleteAllMutation.mutateAsync,
    })
  }

  return (
    <>
      <div className='flex gap-2'>
        <DataTableActions
          deleteAll={{
            handle: handleDeleteAll,
            data: { disabled: users?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={users.data}
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
