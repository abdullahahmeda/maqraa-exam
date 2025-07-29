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
import type {
  SystemExam,
} from '~/kysely/types'
import { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { Checkbox } from '~/components/ui/checkbox'
import { FilterHeader } from '~/components/ui/filter-header'
import { type Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { deleteRows } from '~/utils/client/deleteRows'
import { Combobox } from '~/components/ui/combobox'
import { formatDate } from '~/utils/formatDate'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  typeMapping as examTypeMapping,
  enTypeToAr as enExamTypeToAr,
} from '~/utils/exams'
import { formatDistanceToNow } from 'date-fns'
import { buttonVariants } from '~/components/ui/button'
import { useSession } from 'next-auth/react'
import { useDeleteModal } from './delete-modal'

type Row = Selectable<SystemExam> & {
  cycleName: string
  curriculumName: string
  trackName: string
  courseName: string
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()
  const { setExamId: openDeleteExamModal } = useDeleteModal()
  const { data: session } = useSession()

  useEffect(() => {
    router.prefetch(`/dashboard/exams/edit/${row.original.id}`)
  }, [router, row.original.id])


  return (
    <>
      <RowActions
        // viewButton={{
        //   onClick: () => router.push(`/dashboard/exams/${row.original.id}`),
        // }}
        deleteButton={
          session?.user.role.includes('ADMIN')
            ? {
                onClick: () => openDeleteExamModal(row.original.id),
              }
            : undefined
        }
        editButton={
          session?.user.role.includes('ADMIN')
            ? {
                onClick: () =>
                  router.push(`/dashboard/exams/edit/${row.original.id}`),
              }
            : undefined
        }
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
    header: 'الإختبار',
    cell: ({ row }) => (
      <a
        href={`/dashboard/exams/${row.original.id}`}
        className={buttonVariants({ variant: 'link' })}
      >
        {row.original.name}
      </a>
    ),
  },
  {
    accessorKey: 'courseName',
    header: 'المقرر'
  },
  {
    accessorKey: 'trackName',
    header: 'المسار'
  },
  {
    accessorKey: 'curriculumName',
    id: 'curriculumId',
    header: ({ column }) => {
      const { data: curricula, isLoading } = api.curriculum.getList.useQuery()
      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='المنهج'
          filter={
            <Combobox
              items={[
                { name: 'الكل', id: '' },
                ...(curricula ?? [])
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
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <FilterHeader
          label='النوع'
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
                {Object.entries(examTypeMapping).map(([label, value]) => (
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
    cell: ({ row }) => enExamTypeToAr(row.original.type),
  },
  {
    accessorKey: 'cycleName',
    id: 'cycleId',
    header: ({ column }) => {
      const { data: cycles, isLoading } = api.cycle.getList.useQuery()

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='الدورة'
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
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'وقت الإنشاء',
    cell: ({ row }) => formatDate(row.original.createdAt),
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'endsAt',
    header: 'وقت القفل',
    cell: ({ row }) =>
      row.original.endsAt ? (
        <div>
          {formatDate(row.original.endsAt)}{' '}
          {row.original.endsAt > new Date() ? (
            <div>
              مفتوح{' '}
              <Badge>
                يغلق خلال {formatDistanceToNow(row.original.endsAt)}
              </Badge>
            </div>
          ) : (
            <Badge variant='destructive'>مغلق</Badge>
          )}
        </div>
      ) : (
        <Badge>مفتوح دائماً</Badge>
      ),
    filterFn: () => true,
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

export const ExamsTable = () => {
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
  const bulkDeleteMutation = api.exam.bulkDelete.useMutation()
  const deleteAllMutation = api.exam.deleteAll.useMutation()

  const filters = columnFilters.reduce(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  )

  const { data: exams, isFetching, isPending, isError } = api.exam.getTableList.useQuery(
    { pagination, filters },
    { refetchOnMount: false },
  )

  useEffect(() => {
    setPagination(({ pageSize }) => ({
      pageIndex: 0,
      pageSize,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  if (isPending) {
    return <DataTable data={[]} columns={columns} isFetching rowId='id' />
  }
  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء التحميل</p>
  }

  const pageCount = Math.ceil(exams.count / pagination.pageSize)

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
            data: { disabled: exams?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={exams.data}
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
