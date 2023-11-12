import { Course, Curriculum, Cycle, Quiz, User } from '~/kysely/types'
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
import { ReactNode, useMemo, useState } from 'react'
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
import {
  FileCheck2,
  Filter,
  Trash,
  Link as LinkIcon,
  Plus,
  LogIn,
  Pencil,
  Download,
} from 'lucide-react'
import { formatDate } from '~/utils/formatDate'
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
  enTypeToAr,
} from '~/utils/exams'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { Combobox } from '~/components/ui/combobox'
import { getServerAuthSession } from '~/server/auth'
import { useSession } from 'next-auth/react'
import { AddSystemExamDialog } from '~/components/modals/add-system-exam'
import { DeleteQuizDialog } from '~/components/modals/delete-quiz'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '~/components/ui/tooltip'
import { db } from '~/server/db'
import { EditQuizDialog } from '~/components/modals/edit-quiz'
import { percentage } from '~/utils/percentage'
import { useToast } from '~/components/ui/use-toast'

type Row = Quiz & {
  examinee: User
  corrector: User | null
  systemExam: { name: string; cycle: Cycle }
  curriculum: Curriculum & { track: { course: Course } }
}

const columnHelper = createColumnHelper<any>()

const PAGE_SIZE = 50

const MyExamsPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
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

  const columns = useMemo(
    () => [
      ...(session?.user.role === 'CORRECTOR'
        ? [
            columnHelper.accessor('examinee.name', {
              header: 'الطالب',
            }),
            columnHelper.accessor('examinee.email', {
              header: 'إيميل الطالب',
            }),
          ]
        : []),
      columnHelper.accessor('systemExamName', {
        id: 'systemExamId',
        header: ({ column }) => {
          const { data: systemExams, isLoading } = api.systemExam.list.useQuery(
            {}
          )

          const filterValue = column.getFilterValue() as string | undefined

          return (
            <div className='flex items-center'>
              الإختبار
              <Popover>
                <PopoverTrigger className='mr-4' asChild>
                  <Button
                    size='icon'
                    variant={filterValue ? 'secondary' : 'ghost'}
                  >
                    <Filter className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Combobox
                    items={[
                      { name: 'الكل', id: 'not_null' },
                      ...(systemExams || []),
                    ]}
                    loading={isLoading}
                    labelKey='name'
                    valueKey='id'
                    onSelect={column.setFilterValue}
                    value={filterValue}
                    triggerText='الكل'
                    triggerClassName='w-full'
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        },
      }),
      columnHelper.accessor('cycleName', {
        id: 'cycle',
        header: ({ column }) => {
          const { data: cycles, isLoading } = api.cycle.list.useQuery({})

          const filterValue = column.getFilterValue() as string | undefined

          return (
            <div className='flex items-center'>
              الدورة
              <Popover>
                <PopoverTrigger className='mr-4' asChild>
                  <Button
                    size='icon'
                    variant={filterValue ? 'secondary' : 'ghost'}
                  >
                    <Filter className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Combobox
                    items={[{ name: 'الكل', id: '' }, ...(cycles || [])]}
                    loading={isLoading}
                    labelKey='name'
                    valueKey='id'
                    onSelect={column.setFilterValue}
                    value={filterValue}
                    triggerText='الكل'
                    triggerClassName='w-full'
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        },
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor(
        (row) => `${row.courseName} :${row.curriculumName}`,
        {
          id: 'curriculum',
          header: ({ column, table }) => {
            const { data: curricula, isLoading } = api.curriculum.list.useQuery(
              {
                include: { track: true },
              }
            )
            const filterValue = column.getFilterValue() as string | undefined
            return (
              <div className='flex items-center'>
                المنهج
                <Popover>
                  <PopoverTrigger className='mr-4' asChild>
                    <Button
                      size='icon'
                      variant={filterValue ? 'secondary' : 'ghost'}
                    >
                      <Filter className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Combobox
                      items={[
                        { name: 'الكل', id: '' },
                        ...(curricula?.map((c) => ({
                          ...c,
                          name: `${c.courseName}: ${c.name}`,
                        })) || []),
                      ]}
                      loading={isLoading}
                      labelKey='name'
                      valueKey='id'
                      onSelect={column.setFilterValue}
                      value={filterValue}
                      triggerText='الكل'
                      triggerClassName='w-full'
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )
          },
          meta: {
            className: 'text-center',
          },
        }
      ),
      columnHelper.accessor('grade', {
        header: 'الدرجة',
        cell: ({ getValue, row }) =>
          typeof getValue() === 'number'
            ? `${
                !row.original.correctedAt ? 'الدرجة المتوقعة: ' : ''
              }${getValue()} من ${row.original.total} (${percentage(
                getValue() as number,
                row.original.total as number
              )}%)`
            : '-',
      }),
      columnHelper.accessor('endsAt', {
        header: 'وقت القفل',
        cell: (info) =>
          info.getValue() ? (
            <div>
              {formatDate(info.getValue() as unknown as Date)}{' '}
              {(info.getValue() as unknown as Date) > new Date() ? (
                <Badge>مفتوح</Badge>
              ) : (
                <Badge variant='destructive'>مغلق</Badge>
              )}
            </div>
          ) : (
            '-'
          ),
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('enteredAt', {
        header: 'وقت البدأ',
        cell: (info) =>
          info.getValue()
            ? formatDate(info.getValue() as unknown as Date)
            : '-',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('submittedAt', {
        header: 'وقت التسليم',
        cell: (info) =>
          info.getValue()
            ? formatDate(info.getValue() as unknown as Date)
            : '-',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('correctedAt', {
        header: 'وقت التصحيح',
        cell: (info) =>
          info.getValue()
            ? formatDate(info.getValue() as unknown as Date)
            : '-',
        meta: {
          className: 'text-center',
        },
      }),
      ...(session?.user.role === 'STUDENT'
        ? [
            columnHelper.accessor('corrector.name', {
              header: 'المصحح',
              cell: (info) => info.getValue() || '-',
              meta: {
                className: 'text-center',
              },
            }),
          ]
        : []),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            {session?.user.role === 'CORRECTOR' ? (
              <>
                {!!row.original.submittedAt && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' })
                          )}
                          href={`/dashboard/quizzes/${row.original.id}`}
                        >
                          <FileCheck2 className='h-4 w-4 text-success' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تصحيح الإختبار</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
          className: 'text-center',
        },
      }),
    ],
    []
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'systemExamId',
      value: 'not_null',
    },
  ])

  const filters = columnFilters.reduce(
    (obj, f) => ({ ...obj, [f.id]: f.value }),
    {}
  )

  const { data: quizzes, isFetching } = api.quiz.list.useQuery(
    {
      pagination,
      include: {
        // examinee: true,
        ...(session?.user.role === 'CORRECTOR' ? { examinee: true } : {}),
        ...(session?.user.role === 'STUDENT' ? { corrector: true } : {}),
        curriculum: true,
        systemExam: true,
        // systemExam: { select: { name: true, cycle: true } },
        // curriculum: { include: { track: { select: { course: true } } } },
      },
      filters,
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.quiz.count.useQuery(
    { filters },
    { networkMode: 'always' }
  )

  const pageCount =
    quizzes !== undefined && typeof count === 'number'
      ? Math.ceil((count as number) / pageSize)
      : -1

  const table = useReactTable({
    data: (quizzes as any[]) || [],
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
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Head>
        <title>إختبارات النظام</title>
      </Head>
      <div>
        <div className='mb-2 flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>إختبارات النظام</h2>
        </div>
        <DataTable table={table} fetching={isFetching} />
      </div>
    </>
  )
}

MyExamsPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  return {
    props: { session },
  }
}
export default MyExamsPage
