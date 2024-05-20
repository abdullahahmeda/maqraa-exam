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
import type { Course, Question, QuestionStyle } from '~/kysely/types'
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
import { Textarea } from '~/components/ui/textarea'
import { Combobox } from '~/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  difficultyMapping,
  enDifficultyToAr,
  enTypeToAr,
  typeMapping,
} from '~/utils/questions'
import { Badge } from '~/components/ui/badge'

type Row = Selectable<Question> & { course: Selectable<Course> | null }

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const router = useRouter()

  const utils = api.useUtils()

  const [open, setOpen] = useState(false)

  const mutation = api.question.delete.useMutation()

  useEffect(() => {
    router.prefetch(`/dashboard/questions/edit/${row.original.id}`)
    router.prefetch(`/dashboard/questions/view/${row.original.id}`)
  }, [router, row.original.id])

  const deleteQuestion = (id: string) => {
    const promise = mutation.mutateAsync(id)

    void promise.then(() => {
      void utils.question.list.invalidate()
    })

    toast.promise(promise, {
      loading: 'جاري حذف السؤال...',
      success: 'تم حذف السؤال بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف السؤال',
    })
  }

  return (
    <>
      <RowActions
        deleteButton={{
          onClick: () => setOpen(true),
        }}
        infoButton={{
          onClick: () =>
            router.push(`/dashboard/questions/view/${row.original.id}`),
        }}
        // TODO: add edit feature
        // editButton={{
        //   onClick: () =>
        //     router.push(`/dashboard/questions/edit/${row.original.id}`),
        // }}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا السؤال وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteQuestion(row.original.id)}>
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
    accessorKey: 'number',
    header: function Header({ column }) {
      const [value, setValue] = useState(
        (column.getFilterValue() as string) ?? '',
      )

      const debouncedChangeColumnValue = useCallback(
        debounce(
          (value: number | undefined) => column.setFilterValue(value),
          500,
        ),
        [],
      )

      return (
        <FilterHeader
          label='رقم السؤال'
          filter={
            <Input
              type='number'
              value={value}
              onChange={(e) => {
                const value = e.target.valueAsNumber
                if (isNaN(value)) {
                  setValue('')
                  debouncedChangeColumnValue(undefined)
                } else {
                  setValue('' + value)
                  debouncedChangeColumnValue(value)
                }
              }}
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
    accessorKey: 'partNumber',
    header: function Header({ column }) {
      const [value, setValue] = useState(
        (column.getFilterValue() as string) ?? '',
      )

      const debouncedChangeColumnValue = useCallback(
        debounce(
          (value: number | undefined) => column.setFilterValue(value),
          500,
        ),
        [],
      )

      return (
        <FilterHeader
          label='رقم الجزء'
          filter={
            <Input
              type='number'
              value={value}
              onChange={(e) => {
                const value = e.target.valueAsNumber
                if (isNaN(value)) {
                  setValue('')
                  debouncedChangeColumnValue(undefined)
                } else {
                  setValue('' + value)
                  debouncedChangeColumnValue(value)
                }
              }}
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
    accessorKey: 'pageNumber',
    header: function Header({ column }) {
      const [value, setValue] = useState(
        (column.getFilterValue() as string) ?? '',
      )

      const debouncedChangeColumnValue = useCallback(
        debounce(
          (value: number | undefined) => column.setFilterValue(value),
          500,
        ),
        [],
      )

      return (
        <FilterHeader
          label='رقم الصفحة'
          filter={
            <Input
              type='number'
              value={value}
              onChange={(e) => {
                const value = e.target.valueAsNumber
                if (isNaN(value)) {
                  setValue('')
                  debouncedChangeColumnValue(undefined)
                } else {
                  setValue('' + value)
                  debouncedChangeColumnValue(value)
                }
              }}
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
    accessorKey: 'hadithNumber',
    header: function Header({ column }) {
      const [value, setValue] = useState(
        (column.getFilterValue() as string) ?? '',
      )

      const debouncedChangeColumnValue = useCallback(
        debounce(
          (value: number | undefined) => column.setFilterValue(value),
          500,
        ),
        [],
      )

      return (
        <FilterHeader
          label='رقم الحديث'
          filter={
            <Input
              type='number'
              value={value}
              onChange={(e) => {
                const value = e.target.valueAsNumber
                if (isNaN(value)) {
                  setValue('')
                  debouncedChangeColumnValue(undefined)
                } else {
                  setValue('' + value)
                  debouncedChangeColumnValue(value)
                }
              }}
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
    accessorKey: 'text',
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
          label='نص الحديث'
          filter={
            <Textarea
              value={value}
              onChange={(e) => {
                const value = e.target.value
                setValue(value)
                debouncedChangeColumnValue(value)
              }}
            />
          }
          column={column}
        />
      )
    },
    filterFn: () => true,
    meta: {
      tdClassName: 'truncate max-w-[200px]',
    },
  },
  {
    accessorKey: 'course.name',
    id: 'courseId',
    header: function Header({ column }) {
      const { data: courses, isLoading } = api.course.list.useQuery()

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <FilterHeader
          label='المقرر'
          filter={
            <Combobox
              items={[{ name: 'الكل', id: '' }, ...(courses?.data ?? [])]}
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
    header: function Header({ column }) {
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
                {Object.entries(typeMapping).map(([label, value]) => (
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
    cell: ({ row }) => <Badge>{enTypeToAr(row.original.type)}</Badge>,
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'styleId',
    header: function Header({ column }) {
      const { data: styles, isLoading } = api.questionStyle.list.useQuery()
      const filterValue = column.getFilterValue() as string | undefined
      return (
        <FilterHeader
          label='الأسلوب'
          filter={
            <Combobox
              items={[{ name: 'الكل', id: '' }, ...(styles?.data ?? [])]}
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
    cell: ({ row, table }) => (
      <Badge>
        {
          (
            table.options.meta as {
              questionStyles: Record<string, Selectable<QuestionStyle>>
            }
          ).questionStyles?.[row.original.styleId]?.name
        }
      </Badge>
    ),
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'difficulty',
    header: function Header({ column }) {
      return (
        <FilterHeader
          label='المستوى'
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
                {Object.entries(difficultyMapping).map(([label, value]) => (
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
    cell: ({ row }) => (
      <Badge>{enDifficultyToAr(row.original.difficulty)}</Badge>
    ),
    meta: {
      textAlign: 'center',
    },
  },
  {
    accessorKey: 'answer',
    header: 'الإجابة',
    meta: {
      tdClassName: 'truncate max-w-[300px]',
    },
  },
  {
    accessorKey: 'anotherAnswer',
    header: 'إجابة أخرى',
  },
  {
    accessorKey: 'isInsideShaded',
    header: 'داخل المظلل',
    cell: ({ row }) => (row.original.isInsideShaded ? 'نعم' : 'لا'),
  },
  {
    accessorKey: 'objective',
    header: 'يستهدف السؤال',
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
  },
]

export const QuestionsTable = ({
  initialData,
  questionStyles,
}: {
  initialData: { data: Row[]; count: number }
  questionStyles: Record<string, Selectable<QuestionStyle>>
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

  const invalidate = () => utils.question.invalidate()

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }
  const bulkDeleteMutation = api.question.bulkDelete.useMutation()
  const deleteAllMutation = api.question.deleteAll.useMutation()

  const filters = columnFilters.reduce(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  )

  const { data: questions, isFetching } = api.question.list.useQuery(
    { pagination, filters, include: { course: true } },
    { initialData, refetchOnMount: false },
  )

  useEffect(() => {
    setPagination(({ pageSize }) => ({
      pageIndex: 0,
      pageSize,
    }))
  }, [columnFilters])

  const pageCount = Math.ceil(questions.count / pagination.pageSize)

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
            data: { disabled: questions?.count === 0 },
          }}
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
        />
      </div>
      <DataTable
        data={questions.data}
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
        meta={{
          questionStyles,
        }}
        rowId='id'
      />
    </>
  )
}
