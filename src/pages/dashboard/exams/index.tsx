import { Exam, User } from '@prisma/client'
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
  flexRender
} from '@tanstack/react-table'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useMemo, useState } from 'react'
import { z } from 'zod'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
import DashboardLayout from '../../../components/dashboard-layout'
import Pagination from '../../../components/pagination'
import Spinner from '../../../components/spinner'
import { QuestionDifficulty } from '../../../constants'
import { api } from '../../../utils/api'
import {
  enDifficultyToAr,
  getDifficultyVariant
} from '../../../utils/questions'

const columnHelper = createColumnHelper<
  Exam & {
    user: User
    questions: {
      id: number
    }[]
  }
>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID'
  }),
  columnHelper.accessor('user.email', {
    header: 'المستخدم'
  }),
  columnHelper.accessor('grade', {
    header: 'الدرجة',
    cell: info => (
      <Badge
        className='relative bottom-2 mr-auto'
        text={
          info.getValue() === null
            ? 'لم يتم التصحيح'
            : `${info.getValue()} من ${info.row.original.questions.length}`
        }
        variant={info.getValue() !== null ? 'primary' : 'warning'}
      />
    )
  }),
  columnHelper.accessor('createdAt', {
    header: 'وقت البدأ',
    cell: info => info.getValue().toString()
  }),
  columnHelper.accessor('difficulty', {
    header: 'المستوى',
    cell: info => (
      <Badge
        text={enDifficultyToAr(info.getValue())}
        variant={getDifficultyVariant(info.getValue() as QuestionDifficulty)}
      />
    )
  }),
  columnHelper.accessor('submittedAt', {
    header: 'وقت التسليم',
    cell: info =>
      info.getValue()?.toString() ?? (
        <Badge text='لم يتم التسليم' variant='error' />
      )
  }),
  columnHelper.display({
    id: 'actions',
    header: 'الإجراءات',
    cell: info => (
      <Button as={Link} href={`/dashboard/exams/${info.row.original.id}`}>
        تصحيح
      </Button>
    )
  })
]

type Props = {
  page: number
}

const PAGE_SIZE = 50

const ExamsPage = ({ page: initialPage }: Props) => {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE
    }),
    [pageSize, pageIndex]
  )

  const {
    data,
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions,
    isLoadingError
  } = api.exams.list.useQuery(
    {
      page: pageIndex + 1
    },
    {
      networkMode: 'always',
      trpc: {
        ssr: false
      }
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const table = useReactTable({
    data: data?.exams || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  const changePageIndex = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    router.replace(
      {
        query: { ...router.query, page: pageIndex + 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  const renderTableBody = (): ReactNode => {
    if (isLoadingQuestions) {
      return (
        <tr>
          <td colSpan={99}>
            <span className='flex items-center justify-center gap-2 text-center'>
              <Spinner variant='primary' />
              جاري التحميل..
            </span>
          </td>
        </tr>
      )
    }

    if (isLoadingError) {
      return (
        <tr>
          <td colSpan={99}>
            <div className='flex flex-col items-center justify-center gap-2 text-center'>
              <p className='text-red-500'>
                حدث خطأ أثناء تحميل البيانات، يرجى إعادة المحاولة
              </p>
              <Button onClick={() => refetchQuestions()} variant='primary'>
                إعادة المحاولة
              </Button>
            </div>
          </td>
        </tr>
      )
    }

    if (table.getRowModel().rows.length === 0)
      return (
        <tr>
          <td colSpan={99} className='text-center'>
            لا يوجد بيانات
          </td>
        </tr>
      )
    return table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id} className='text-sm'>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <>
      <Head>
        <title>التسليمات</title>
      </Head>
      <div>
        <table className='w-full'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>

        <nav className='flex justify-center'>
          <Pagination
            pageCount={pageCount}
            pageIndex={pageIndex}
            changePageIndex={changePageIndex}
          />
        </nav>
      </div>
    </>
  )
}

ExamsPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async context => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1
    }
  }
}

export default ExamsPage
