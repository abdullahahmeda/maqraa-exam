'use client'

import {
  createColumnHelper,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
} from '@tanstack/react-table'
import { type Selectable } from 'kysely'
import { FileCheck2Icon, LinkIcon, LogInIcon, EyeIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
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

export type Row = Selectable<Quiz> & {
  examinee: Selectable<User> | null
  corrector: Selectable<User> | null
  model: Selectable<Model> | null
}

const RowActionCell = ({ row }: { row: { original: Row } }) => {
  const { data: session } = useSession()

  if (session!.user.role === 'STUDENT') {
    return (
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
              {row.original.submittedAt !== null ? (
                <EyeIcon className='h-4 w-4' />
              ) : (
                <LogInIcon className='h-4 w-4' />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            {row.original.submittedAt !== null
              ? 'مراجعة الاختبار'
              : 'دخول الإختبار'}
          </TooltipContent>
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
    </div>
  )
}

const columnHelper = createColumnHelper<Row>()

const columns = [
  columnHelper.accessor('examinee.name', {
    header: 'الطالب',
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor('examinee.email', {
    header: 'إيميل الطالب',
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
          }${getValue()} من ${row.original.model!.total} (${percentage(
            getValue()!,
            row.original.model!.total,
          )}%)`
        : '-',
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
  columnHelper.display({
    id: 'actions',
    header: 'الإجراءات',
    cell: RowActionCell,
    meta: {
      textAlign: 'center',
    },
  }),
]

export const QuizzesTable = ({
  initialData,
}: {
  initialData: { data: Row[]; count: number }
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams?.get('page')

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

  const { data: quizzes, isFetching } = api.quiz.list.useQuery(
    {
      pagination,
      filters: { ...filters, systemExamId: null },
      include: { examinee: true, corrector: true },
    },
    // @ts-expect-error No error here, just because dynamic "include" typings
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

  return (
    <div>
      <DataTable
        data={quizzes.data}
        // @ts-expect-error Vercel is playing with us
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
        rowId='id'
      />
    </div>
  )
}
