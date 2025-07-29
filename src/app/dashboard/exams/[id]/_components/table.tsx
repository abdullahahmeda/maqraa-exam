'use client'

import {
  createColumnHelper,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
} from '@tanstack/react-table'
import { type TRPCError } from '@trpc/server'
import { type Selectable } from 'kysely'
import debounce from 'lodash.debounce'
import { FileCheck2Icon, LinkIcon, LogInIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { FilterHeader } from '~/components/ui/filter-header'
import { Input } from '~/components/ui/input'
import { RowActions } from '~/components/ui/row-actions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import type { Model, Quiz, SystemExam, User } from '~/kysely/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { formatDate } from '~/utils/formatDate'
import { percentage } from '~/utils/percentage'
import { saveAs } from 'file-saver'
import { useDeleteModal } from './delete-modal'

export type Row = Selectable<Quiz> & {
  examineeName: string
  examineeEmail: string
  correctorName: string | null
  modelTotal: number
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const { data: session } = useSession()
  const { setQuizId: openDeleteQuizModal } = useDeleteModal()

  if (session!.user.role === 'STUDENT') {
    const cannotEnterQuiz =
      (row.original.endsAt !== null && row.original.endsAt < new Date()) ||
      row.original.submittedAt !== null

    return cannotEnterQuiz ? null : (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                }),
              )}
              href={`/quiz/${row.original.id}`}
            >
              <LogInIcon className='h-4 w-4' />
            </Link>
          </TooltipTrigger>
          <TooltipContent>دخول الإختبار</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const canBeCorrected = row.original.submittedAt !== null

  return (
    <div className='flex gap-1'>
      <TooltipProvider delayDuration={100}>
        {canBeCorrected && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon',
                  }),
                )}
                href={`/dashboard/quizzes/${row.original.id}/correct`}
              >
                <FileCheck2Icon className='h-4 w-4 text-success' />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>تصحيح الإختبار</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              onClick={() => {
                navigator.clipboard
                  .writeText(`${location.origin}/quiz/${row.original.id}`)
                  .then(() =>
                    toast.success('تم نسخ رابط الإختبار إلى الحافظة بنجاح'),
                  )
                  .catch(() => toast.error('تعذر النسخ إلى الحافظة'))
              }}
            >
              <LinkIcon className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>نسخ رابط الإختبار</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {session?.user.role.includes('ADMIN') && (
        <RowActions
          deleteButton={{
            onClick: () => openDeleteQuizModal(row.original.id),
          }}
        />
      )}
    </div>
  )
}

const columnHelper = createColumnHelper<Row>()

const columns = [
  columnHelper.accessor('examineeName', {
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
          label='الطالب'
          filter={
            <Input
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
    cell: (info) => info.getValue() || '-',
    filterFn: () => true,
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('examineeEmail', {
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
          label='إيميل الطالب'
          filter={
            <Input
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
    cell: (info) => info.getValue() || '-',
    filterFn: () => true,
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('grade', {
    header: 'الدرجة',
    cell: ({ getValue, row }) =>
      typeof getValue() === 'number'
        ? `${
            !row.original.correctedAt ? 'الدرجة المتوقعة: ' : ''
          }${getValue()} من ${row.original.modelTotal} (${percentage(
            getValue()!,
            row.original.modelTotal,
          )}%)`
        : '-',
  }),
  columnHelper.accessor('endsAt', {
    header: 'وقت القفل',
    cell: (info) =>
      info.getValue() ? (
        <div>
          {formatDate(info.getValue()!)}{' '}
          {info.getValue()! > new Date() ? (
            <Badge>مفتوح</Badge>
          ) : (
            <Badge variant='destructive'>مغلق</Badge>
          )}
        </div>
      ) : (
        '-'
      ),
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('enteredAt', {
    header: 'وقت البدأ',
    cell: (info) => (info.getValue() ? formatDate(info.getValue()!) : '-'),
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('submittedAt', {
    header: 'وقت التسليم',
    cell: (info) => (info.getValue() ? formatDate(info.getValue()!) : '-'),
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('correctedAt', {
    header: 'وقت التصحيح',
    cell: (info) => (info.getValue() ? formatDate(info.getValue()!) : '-'),
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('correctorName', {
    header: 'المصحح',
    cell: (info) => info.getValue() || '-',
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
    meta: {
      textAlign: 'center',
    },
  }),
]

export const ExamTable = ({
  initialData,
  systemExam,
}: {
  initialData: { data: Row[]; count: number }
  systemExam: Selectable<SystemExam>
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

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const params = new URLSearchParams(searchParams?.toString())
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater
    params.set('page', `${newState.pageIndex + 1}`)
    router.push(pathname + '?' + params.toString())
  }

  const filters = columnFilters.reduce(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  )

  const { data: quizzes, isFetching } = api.quiz.getTableListForExam.useQuery(
    {
      pagination,
      filters: { ...filters, systemExamId: systemExam.id },
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

  const pageCount = Math.ceil(quizzes.count / pagination.pageSize)

  const selectedRows = Object.keys(rowSelection)

  const quizzesExport = api.quiz.export.useMutation()

  const handleDownload = async () => {
    const promise = quizzesExport
      .mutateAsync({ systemExamId: systemExam.id })
      .then((arrayBuffer) => {
        const content = new Blob([arrayBuffer])
        saveAs(content, `الإختبار ${systemExam.name}.xlsx`)
      })
    toast.promise(promise, {
      loading: 'يتم تجهيز الملف للتحميل...',
      success: 'تم بدأ تحميل الملف',
      error: (error) => (error as TRPCError).message,
    })
  }

  return (
    <div>
      <DataTableActions
        excelExport={{
          handle: handleDownload,
          data: { disabled: !quizzes || quizzes.count === 0 },
        }}
      />
      <DataTable
        data={quizzes.data}
        // @xts-expect-error Vercel is playing with us
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
    </div>
  )
}
