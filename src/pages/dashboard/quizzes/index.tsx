import { Curriculum, Quiz, User } from '~/kysely/types'
import {
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
import { ReactNode, useState } from 'react'
import { z } from 'zod'
import { Button, buttonVariants } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import { api } from '~/utils/api'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { DataTable } from '~/components/ui/data-table'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Filter, Trash, Link as LinkIcon, Plus, LogIn } from 'lucide-react'
import { formatDate } from '~/utils/formatDate'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { Combobox } from '~/components/ui/combobox'
import { getServerAuthSession } from '~/server/auth'
import { useSession } from 'next-auth/react'
import { NewSystemExamDialog } from '~/components/modals/new-system-exam'
import { DeleteQuizDialog } from '~/components/modals/delete-quiz'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '~/components/ui/tooltip'
import { percentage } from '~/utils/percentage'
import { getColumnFilters } from '~/utils/getColumnFilters'

type Row = Quiz & {
  examineeName: string
  examineeEmail: string
  curriculumName: string
}

const columnFiltersValidators = {
  // type: z.nativeEnum(QuizType),
}

const columnHelper = createColumnHelper<Row>()

const PAGE_SIZE = 50

const ExamsPage = () => {
  const router = useRouter()

  const { data: session } = useSession()

  const [dialogOpen, setDialogOpen] = useState(false)

  const pageIndex = z
    .preprocess((v) => Number(v), z.number().positive().int())
    .safeParse(router.query.page).success
    ? Number(router.query.page) - 1
    : 0

  const pageSize = PAGE_SIZE

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  }

  const columns = [
    columnHelper.accessor('examineeName', {
      header: 'الطالب',
      cell: (info) => info.getValue() || '-',
      meta: {
        textAlign: 'center',
      },
    }),
    columnHelper.accessor('examineeEmail', {
      header: 'الإيميل',
      cell: (info) => info.getValue() || '-',
      meta: {
        textAlign: 'center',
      },
    }),
    columnHelper.accessor('curriculumName', {
      id: 'curriculum',
      header: 'المنهج',
      // header: ({ column, table }) => {
      //   const { data: curricula, isLoading } = api.curriculum.findMany.useQuery(
      //     {
      //       where: {
      //         track: {
      //           courseId:
      //             table.getState().columnFilters.find((f) => f.id === 'course')
      //               ?.value || undefined,
      //         },
      //       },
      //     }
      //   )
      //   const filterValue = column.getFilterValue() as string | undefined
      //   return (
      //     <div className='flex items-center'>
      //       المنهج
      //       <Popover>
      //         <PopoverTrigger className='mr-4' asChild>
      //           <Button
      //             size='icon'
      //             variant={filterValue ? 'secondary' : 'ghost'}
      //           >
      //             <Filter className='h-4 w-4' />
      //           </Button>
      //         </PopoverTrigger>
      //         <PopoverContent>
      //           <Combobox
      //             items={[{ name: 'الكل', id: '' }, ...(curricula || [])]}
      //             loading={isLoading}
      //             labelKey='name'
      //             valueKey='id'
      //             onSelect={column.setFilterValue}
      //             value={filterValue}
      //             triggerText='الكل'
      //             triggerClassName='w-full'
      //           />
      //         </PopoverContent>
      //       </Popover>
      //     </div>
      //   )
      // },
      meta: {
        textAlign: 'center',
      },
    }),
    columnHelper.accessor('grade', {
      header: 'الدرجة',
      cell: ({ row, getValue }) =>
        typeof getValue() === 'number'
          ? `${getValue()} من ${row.original.total as number} (${percentage(
              getValue()!,
              row.original.total as number
            )}%)`
          : '-',
    }),
    columnHelper.accessor('createdAt', {
      header: 'وقت الإنشاء',
      cell: (info) => formatDate(info.getValue() as unknown as Date),
      meta: {
        textAlign: 'center',
      },
    }),
    columnHelper.accessor('submittedAt', {
      header: 'وقت التسليم',
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as unknown as Date) : '-',
      meta: {
        textAlign: 'center',
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <div className='flex justify-center gap-2'>
          {session?.user.role !== 'STUDENT' ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${location.origin}/quizzes/${row.original.id}`
                        )
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-red-50'
                  >
                    <Trash className='h-4 w-4 text-red-600' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <DeleteQuizDialog id={row.original.id as unknown as string} />
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              {(!row.original.endsAt ||
                (row.original.endsAt &&
                  (row.original.endsAt as unknown as Date) > new Date())) &&
                !row.original.submittedAt && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' })
                          )}
                          href={`/quizzes/${row.original.id}`}
                        >
                          <LogIn className='h-4 w-4' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>دخول الإختبار</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
            </>
          )}
        </div>
      ),
      meta: {
        textAlign: 'center',
      },
    }),
  ]
  const columnFilters = getColumnFilters(router.query, columnFiltersValidators)
  const filters = {
    ...columnFilters.reduce((obj, f) => ({ ...obj, [f.id]: f.value }), {}),
    systemExamId: null,
  }

  const { data: exams, isFetching } = api.quiz.list.useQuery(
    {
      pagination,
      include: { curriculum: true, examinee: true },
      filters,
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.quiz.count.useQuery(
    { filters },
    { networkMode: 'always' }
  )

  const pageCount =
    exams !== undefined && typeof count === 'number'
      ? Math.ceil((count as number) / pageSize)
      : -1

  const table = useReactTable({
    // @ts-ignore
    data: exams || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    onColumnFiltersChange: (updater) => {
      const newColumnFilters: ColumnFiltersState = (
        updater as CallableFunction
      )(columnFilters)
      Object.keys(columnFiltersValidators).forEach((filterId) => {
        delete router.query[filterId]
      })
      newColumnFilters.forEach((filter) => {
        ;(router.query as any)[filter.id] = filter.value
      })
      router.push(router)
    },
  })

  return (
    <>
      <Head>
        <title>الإختبارات التجريبية</title>
      </Head>
      <div>
        <div className='mb-4 flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>الإختبارات التجريبية</h2>
        </div>
        <DataTable table={table} fetching={isFetching} />
      </div>
    </>
  )
}

ExamsPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'CORRECTOR')
    return { notFound: true }

  return {
    props: {
      session,
    },
  }
}
export default ExamsPage
