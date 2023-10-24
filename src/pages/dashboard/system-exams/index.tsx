import {
  Course,
  Curriculum,
  Cycle,
  Quiz,
  QuizType,
  Prisma,
  SystemExam,
  User,
  UserRole,
  Track,
} from '@prisma/client'
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
import {
  FileCheck2,
  Filter,
  Trash,
  Link as LinkIcon,
  Plus,
  LogIn,
  EyeIcon,
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
import { DeleteSystemExamDialog } from '~/components/modals/delete-system-exam'

type Row = SystemExam & {
  cycle: Cycle
  curriculum: Curriculum & { track: Track & { course: Course } }
  quizzes: { id: any }[]
}

const columnHelper = createColumnHelper<Row>()

const PAGE_SIZE = 50

const SystemExamsPage = () => {
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
    columnHelper.accessor('name', {
      header: ({ column }) => {
        // const { data: systemExams, isLoading } =
        //   api.systemExam.findMany.useQuery({})

        // const filterValue = column.getFilterValue() as string | undefined

        return (
          <div className='flex items-center'>
            الإختبار
            {/* <Popover>
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
                  items={[{ name: 'الكل', id: '' }, ...(systemExams || [])]}
                  loading={isLoading}
                  labelKey='name'
                  valueKey='id'
                  onSelect={column.setFilterValue}
                  value={filterValue}
                  triggerText='الكل'
                  triggerClassName='w-full'
                />
              </PopoverContent>
            </Popover> */}
          </div>
        )
      },
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor(
      (row) => `${row.curriculum.track.course.name} :${row.curriculum.name}`,
      {
        id: 'curriculum',
        header: ({ column, table }) => {
          const { data: curricula, isLoading } =
            api.curriculum.findMany.useQuery({
              include: { track: { select: { course: true } } },
            })
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
                        name: `${c.track.course.name}: ${c.name}`,
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
    columnHelper.accessor('type', {
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined

        return (
          <div className='flex items-center'>
            النوع
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
                <Select
                  value={filterValue === undefined ? '' : filterValue}
                  onValueChange={column.setFilterValue}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>الكل</SelectItem>
                    {Object.entries(examTypeMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      cell: ({ getValue }) => enExamTypeToAr(getValue()),
    }),

    columnHelper.accessor('cycle.name', {
      id: 'cycle',
      header: ({ column }) => {
        const { data: tracks, isLoading } = api.cycle.findMany.useQuery({})

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
                  items={[{ name: 'الكل', id: '' }, ...(tracks || [])]}
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
    columnHelper.accessor('createdAt', {
      header: 'وقت الإنشاء',
      cell: (info) => formatDate(info.getValue()),
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('endsAt', {
      header: 'وقت القفل',
      cell: (info) =>
        info.getValue() ? (
          <div>
            {formatDate(info.getValue() as Date)}{' '}
            {(info.getValue() as Date) > new Date() ? (
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
    columnHelper.accessor('quizzes', {
      header: 'الطلاب المستحقين للإختبار',
      cell: (info) => info.getValue().length,
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <div className='flex justify-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={cn(
                    buttonVariants({ size: 'icon', variant: 'ghost' })
                  )}
                  href={`/dashboard/system-exams/${row.original.id}`}
                >
                  <EyeIcon className='h-4 w-4' />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>عرض</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='icon' className='hover:bg-red-50'>
                <Trash className='h-4 w-4 text-red-600' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <DeleteSystemExamDialog id={row.original.id} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      meta: {
        className: 'text-center',
      },
    }),
  ]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const filters = columnFilters.map((filter) => {
    if (filter.id === 'cycle')
      return { systemExam: { cycleId: { equals: filter.value as string } } }
    else if (filter.id === 'curriculum')
      return { curriculumId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: exams, isFetching } = api.systemExam.findMany.useQuery(
    {
      skip: pageIndex * pageSize,
      take: pageSize,
      include: {
        curriculum: { include: { track: { select: { course: true } } } },
        cycle: true,
        quizzes: { select: { id: true } },
      },
      where: { AND: filters },
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } =
    api.systemExam.count.useQuery(
      { where: { AND: filters } },
      { networkMode: 'always' }
    )

  const pageCount =
    exams !== undefined && typeof count === 'number'
      ? Math.ceil((count as number) / pageSize)
      : -1

  const table = useReactTable({
    data: (exams as Row[]) || [],
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
          {session!.user.role === UserRole.ADMIN && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  إضافة إختبار نظام
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>إضافة إختبار نظام</DialogHeader>
                <AddSystemExamDialog setDialogOpen={setDialogOpen} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <DataTable table={table} fetching={isFetching} />
      </div>
    </>
  )
}

SystemExamsPage.getLayout = (page: ReactNode) => (
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
export default SystemExamsPage
