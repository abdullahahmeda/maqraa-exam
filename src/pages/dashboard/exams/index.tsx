import { Course, Curriculum, Exam, User } from '@prisma/client'
import {
  ColumnFilter,
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useMemo, useState } from 'react'
import { z } from 'zod'
import { Button, buttonVariants } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import Pagination from '~/components/pagination'
import { QuestionDifficulty } from '~/constants'
import { api } from '~/utils/api'
import { enDifficultyToAr, getDifficultyVariant } from '~/utils/questions'
import DashboardTable from '~/components/dashboard/table'
import dayjs from 'dayjs'
import { percentage } from '~/utils/percentage'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { Select, SelectTrigger } from '~/components/ui/select'
import { DataTable } from '~/components/ui/data-table'

const columnHelper = createColumnHelper<
  Exam & {
    user: User
    questions: {
      id: number
    }[]
    course: Course
    curriculum: Curriculum
  }
>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('user.email', {
    header: 'المستخدم',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('course.name', {
    header: 'المقرر',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('curriculum.name', {
    header: 'المنهج',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('grade', {
    header: 'الدرجة',
    cell: (info) => (
      <Badge
      // variant={info.getValue() !== null ? 'primary' : 'warning'}
      >
        {info.getValue() === null
          ? 'لم يتم التصحيح'
          : `${info.getValue()} من ${
              info.row.original.questions.length
            } (${percentage(
              info.getValue() as number,
              info.row.original.questions.length
            )}%)`}
      </Badge>
    ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'وقت البدأ',
    cell: (info) => dayjs(info.getValue()).format('DD MMMM YYYY hh:mm A'),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('difficulty', {
    header: 'المستوى',
    cell: (info) => (
      <Badge
      // variant={getDifficultyVariant(info.getValue() as QuestionDifficulty)}
      >
        {enDifficultyToAr(info.getValue())}
      </Badge>
    ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('submittedAt', {
    header: 'وقت التسليم',
    cell: (info) =>
      info.getValue() ? (
        dayjs(info.getValue()).format('DD MMMM YYYY hh:mm A')
      ) : (
        <Badge variant='destructive'>لم يتم التسليم</Badge>
      ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'الإجراءات',
    cell: (info) => (
      <div className='flex justify-center gap-2'>
        <Link
          className={cn(buttonVariants())}
          href={`/dashboard/exams/${info.row.original.id}`}
        >
          تصحيح
        </Link>
        <Button variant='destructive' onClick={() => null}>
          حذف
        </Button>
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  }),
]

type Props = {
  page: number
}

const PAGE_SIZE = 50

const ExamsPage = ({ page: initialPage }: Props) => {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'difficulty',
      value: '',
    },
    {
      id: 'grade',
      value: '',
    },
    {
      id: 'graded',
      value: '',
    },
  ])

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE,
    }),
    [pageSize, pageIndex]
  )

  const {
    data,
    isLoading: isLoading,
    refetch: refetch,
    isLoadingError,
  } = api.exams.list.useQuery(
    {
      page: pageIndex + 1,
      filters: columnFilters.reduce(
        (obj, column) => ({ ...obj, [column.id]: column.value }),
        {}
      ),
    },
    {
      networkMode: 'always',
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const table = useReactTable({
    data: data?.exams || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  })

  const changePageIndex = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    router.replace(
      {
        query: { ...router.query, page: pageIndex + 1 },
      },
      undefined,
      {
        shallow: true,
      }
    )
  }

  const changeColumnFilterValue = (newValue: ColumnFilter) => {
    const newColumnFilters = columnFilters.slice()
    const index = newColumnFilters.findIndex(
      (column) => column.id === newValue.id
    )
    if (index === -1) newColumnFilters.push(newValue)
    else newColumnFilters[index] = newValue
    table.setColumnFilters(newColumnFilters)
  }

  return (
    <>
      <Head>
        <title>التسليمات</title>
      </Head>
      <div>
        <h2 className='mb-2 text-2xl font-bold'>التسليمات</h2>
        <DataTable
          table={table}
          // isLoading={isLoading}
          // isLoadingError={isLoadingError}
          // refetch={refetch}
        />
      </div>
    </>
  )
}

ExamsPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default ExamsPage
