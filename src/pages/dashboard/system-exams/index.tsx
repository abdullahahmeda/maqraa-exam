import { Course, Curriculum, Cycle, SystemExam, Track } from '~/kysely/types'
import { QuizType, UserRole } from '~/kysely/enums'
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
import { FilterIcon, TrashIcon, PlusIcon, EyeIcon } from 'lucide-react'
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
import { NewSystemExamDialog } from '~/components/modals/new-system-exam'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '~/components/ui/tooltip'
import { DeleteSystemExamDialog } from '~/components/modals/delete-system-exam'
import { getColumnFilters } from '~/utils/getColumnFilters'
import { Checkbox } from '~/components/ui/checkbox'
import { deleteRows } from '~/utils/client/deleteRows'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { Selectable } from 'kysely'

type Row = Selectable<SystemExam> & {
  cycle: Cycle
  curriculum: Curriculum & { track: Track & { course: Course } }
  quizzes: { id: any }[]
}

const columnFiltersValidators = {
  type: z.nativeEnum(QuizType),
  curriculumId: z.string(),
  cycleId: z.string(),
}

const columnHelper = createColumnHelper<any>()

const PAGE_SIZE = 50

const SystemExamsPage = () => {
  const utils = api.useUtils()
  const router = useRouter()
  const [rowSelection, setRowSelection] = useState({})
  const { data: session } = useSession()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const pageIndex = z
    .preprocess((v) => Number(v), z.number().positive().int())
    .safeParse(router.query.page).success
    ? Number(router.query.page) - 1
    : 0

  const bulkDeleteMutation = api.systemExam.bulkDelete.useMutation()
  const deleteAllMutation = api.systemExam.deleteAll.useMutation()

  const invalidate = utils.systemExam.invalidate

  const pageSize = PAGE_SIZE

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? table.getIsAllPageRowsSelected()
                : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='تحديد الكل'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='تحديد الصف'
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: 'الإختبار',
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor(
        (row) => `${row.courseName} :${row.curriculumName}`,
        {
          id: 'curriculumId',
          header: ({ column }) => {
            const { data: curricula, isLoading } = api.curriculum.list.useQuery(
              { include: { track: true } }
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
                      <FilterIcon className='h-4 w-4' />
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
            textAlign: 'center',
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
                    <FilterIcon className='h-4 w-4' />
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

      columnHelper.accessor('cycleName', {
        id: 'cycleId',
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
                    <FilterIcon className='h-4 w-4' />
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
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'وقت الإنشاء',
        cell: (info) => formatDate(info.getValue() as unknown as Date),
        meta: {
          textAlign: 'center',
        },
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
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('quizzesCount', {
        header: 'الطلاب المستحقين للإختبار',
        cell: (info) => Number(info.getValue()),
        meta: {
          textAlign: 'center',
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
                  <TrashIcon className='h-4 w-4 text-red-600' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteSystemExamDialog
                  id={row.original.id as unknown as string}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
        meta: {
          textAlign: 'center',
        },
      }),
    ],
    []
  )
  const columnFilters = getColumnFilters(router.query, columnFiltersValidators)
  const filters = columnFilters.reduce(
    (obj, f) => ({ ...obj, [f.id]: f.value }),
    {}
  )

  const { data: exams, isFetching } = api.systemExam.list.useQuery(
    {
      pagination,
      include: { curriculum: true, cycle: true, quizzesCount: true },
      filters,
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } =
    api.systemExam.count.useQuery({ filters }, { networkMode: 'always' })

  const pageCount =
    exams !== undefined && typeof count === 'number'
      ? Math.ceil((count as number) / pageSize)
      : -1

  const table = useReactTable({
    data: (exams as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((item) => item.original)

  const handleBulkDelete = () => {
    deleteRows({
      mutateAsync: () =>
        bulkDeleteMutation.mutateAsync(selectedRows.map((r) => r.id)),
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
      <Head>
        <title>إختبارات النظام</title>
      </Head>
      <div>
        <div className='mb-4 flex items-center gap-4'>
          <h2 className='text-2xl font-bold'>إختبارات النظام</h2>
          {session!.user.role === UserRole.ADMIN && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className='flex items-center gap-2'>
                  <PlusIcon className='h-4 w-4' />
                  إضافة إختبار نظام
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>إضافة إختبار نظام</DialogHeader>
                <NewSystemExamDialog setDialogOpen={setCreateDialogOpen} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <DataTableActions
          bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
          deleteAll={{
            handle: handleDeleteAll,
            data: { disabled: !exams || exams.length === 0 },
          }}
          excelExport={{
            handle: () => setExportDialogOpen(true),
            data: { disabled: !exams || exams.length === 0 },
          }}
        />
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
