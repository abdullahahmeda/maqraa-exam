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
  Course,
  Curriculum,
  Cycle,
  SystemExam,
  Track,
} from '~/kysely/types'
import { useEffect, useState } from 'react'
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
import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'
import { useSession } from 'next-auth/react'

type Row = Selectable<SystemExam> & {
  cycle: Selectable<Cycle> | null
  curriculum:
    | (Selectable<Curriculum> & {
        track:
          | (Selectable<Track> & { course: Selectable<Course> | null })
          | null
      })
    | null
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()
  const { data: session } = useSession()

  const utils = api.useUtils()

  const [open, setOpen] = useState(false)

  const mutation = api.exam.delete.useMutation()

  useEffect(() => {
    router.prefetch(`/dashboard/exams/edit/${row.original.id}`)
  }, [router, row.original.id])

  const deleteExam = (id: string) => {
    const promise = mutation.mutateAsync(id)

    void promise.then(() => {
      void utils.exam.list.invalidate()
    })

    toast.promise(promise, {
      loading: 'جاري حذف الإختبار...',
      success: 'تم حذف الإختبار بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف الإختبار',
    })
  }

  return (
    <>
      <RowActions
        // viewButton={{
        //   onClick: () => router.push(`/dashboard/exams/${row.original.id}`),
        // }}
        deleteButton={
          session?.user.role.includes('ADMIN')
            ? {
                onClick: () => setOpen(true),
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
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا المقرر وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteExam(row.original.id)}>
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
    header: 'الإختبار',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/exams/${row.original.id}`}
        className={buttonVariants({ variant: 'link' })}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorFn: (row) =>
      `${row.curriculum?.track?.course?.name} :${row.curriculum?.name}`,
    id: 'curriculumId',
    header: ({ column }) => {
      const { data: curricula, isLoading } = api.curriculum.list.useQuery({
        include: { track: { course: true } },
      })
      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='المنهج'
          filter={
            <Combobox
              items={[
                { name: 'الكل', id: '' },
                ...(curricula?.data.map((c) => ({
                  ...c,
                  name: `${c.track?.course?.name}: ${c.name}`,
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
    accessorKey: 'cycle.name',
    id: 'cycleId',
    header: ({ column }) => {
      const { data: cycles, isLoading } = api.cycle.list.useQuery()

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='الدورة'
          filter={
            <Combobox
              items={[{ name: 'الكل', id: '' }, ...(cycles?.data ?? [])]}
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

export const ExamsTable = ({
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

  const invalidate = () => utils.exam.invalidate()

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

  const { data: exams, isFetching } = api.exam.list.useQuery(
    {
      pagination,
      filters,
      include: { curriculum: { track: { course: true } }, cycle: true },
    },
    { initialData, refetchOnMount: false },
  )

  useEffect(() => {
    setPagination(({ pageSize }) => ({
      pageIndex: 0,
      pageSize,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  const pageCount = Math.ceil(exams.count / pagination.pageSize)

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
