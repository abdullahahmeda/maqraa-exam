import { Quiz, User } from '~/kysely/types'
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
import { ReactNode, useState, useMemo } from 'react'
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
  FileCheck2Icon,
  FilterIcon,
  TrashIcon,
  Link as LinkIcon,
  LogIn,
  Pencil,
} from 'lucide-react'
import { formatDate } from '~/utils/formatDate'
import { enTypeToAr } from '~/utils/exams'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { getServerAuthSession } from '~/server/auth'
import { useSession } from 'next-auth/react'
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
import { toast } from 'sonner'
import { saveAs } from 'file-saver'
import { CircularProgress } from '~/components/ui/circular-progress'
import { getColumnFilters } from '~/utils/getColumnFilters'
import { Input } from '~/components/ui/input'
import { DataTableActions } from '~/components/ui/data-table-actions'

type Row = Quiz & {
  examinee: User
  corrector: User | null
}

const columnFiltersValidators = {
  examineeName: z.string(),
}

const columnHelper = createColumnHelper<any>()

const PAGE_SIZE = 50

const ExamsPage = ({
  systemExam,
  quizCount,
  submittedQuizCount,
  submittedQuizPercentage,
  avgStats,
}: {
  systemExam: any
  // systemExam: SystemExam & {
  //   cycle: Cycle
  //   curriculum: Curriculum & { track: { course: Course } }
  // }
  quizCount: number
  submittedQuizCount: number
  submittedQuizPercentage: number
  avgStats: any
  // avgStats: { _avg: { grade: number | null; percentage: number | null } }
}) => {
  const router = useRouter()
  const { data: session } = useSession()

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

  const columnFilters = getColumnFilters(router.query, columnFiltersValidators)
  const filters = {
    systemExamId: systemExam.id,
    ...columnFilters.reduce((obj, f) => ({ ...obj, [f.id]: f.value }), {}),
  }
  const columns = useMemo(
    () => [
      columnHelper.accessor('examineeName', {
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined
          return (
            <div className='flex items-center'>
              الطالب
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
                  <Input
                    value={filterValue === undefined ? '' : filterValue}
                    onChange={(e) => {
                      column.setFilterValue(e.target.value)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        },
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
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('enteredAt', {
        header: 'وقت البدأ',
        cell: (info) =>
          info.getValue() ? formatDate(info.getValue() as Date) : '-',
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('submittedAt', {
        header: 'وقت التسليم',
        cell: (info) =>
          info.getValue() ? formatDate(info.getValue() as Date) : '-',
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('correctedAt', {
        header: 'وقت التصحيح',
        cell: (info) =>
          info.getValue() ? formatDate(info.getValue() as Date) : '-',
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
        cell: function Cell({ row }) {
          const [dialogOpen, setDialogOpen] = useState(false)
          return (
            <div className='flex justify-center gap-2'>
              {session?.user.role !== 'STUDENT' ? (
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
                            <FileCheck2Icon className='h-4 w-4 text-success' />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>تصحيح الإختبار</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-orange-50'
                      >
                        <Pencil className='h-4 w-4 text-orange-500' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <EditQuizDialog
                        id={row.original.id}
                        setDialogOpen={setDialogOpen}
                      />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-red-50'
                      >
                        <TrashIcon className='h-4 w-4 text-red-600' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <DeleteQuizDialog id={row.original.id} />
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  {(!row.original.endsAt ||
                    (row.original.endsAt &&
                      row.original.endsAt > new Date())) &&
                    !row.original.submittedAt && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              className={cn(
                                buttonVariants({
                                  variant: 'ghost',
                                  size: 'icon',
                                })
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
          )
        },
        meta: {
          textAlign: 'center',
        },
      }),
    ],
    []
  )

  const include = { examinee: true, corrector: true }

  const { data: quizzes, isFetching } = api.quiz.list.useQuery(
    // @ts-ignore
    { pagination, filters, include },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.quiz.count.useQuery(
    // @ts-ignore
    { filters },
    { networkMode: 'always' }
  )

  const quizzesExport = api.quiz.export.useMutation()

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
    state: { pagination, columnFilters },
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

  const handleDownload = async () => {
    const promise = quizzesExport
      .mutateAsync({ systemExamId: systemExam.id as unknown as string })
      .then((arrayBuffer) => {
        const content = new Blob([arrayBuffer])
        saveAs(content, `الإختبار ${systemExam.name}.xlsx`)
      })
    toast.promise(promise, {
      loading: 'يتم تجهيز الملف للتحميل...',
      success: 'تم بدأ تحميل الملف',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <Head>
        <title>إختبارات النظام</title>
      </Head>
      <div>
        <div className='mb-4 flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>إختبارات النظام</h2>
        </div>
        <div className='mb-4 rounded-md bg-white p-4 shadow'>
          <div>
            <h3 className='mb-2 text-xl font-bold'>نظرة عامة</h3>
            <p>اسم الإختبار: {systemExam.name}</p>
            <p>نوع الإختبار: {enTypeToAr(systemExam.type)}</p>
            <p>الدورة: {systemExam.cycleName}</p>
            <p>المقرر: {systemExam.courseName}</p>
            <p>المنهج: {systemExam.curriculumName}</p>
            <p>وقت إنشاء الإختبار: {formatDate(systemExam.createdAt)}</p>
            <div>
              <span>وقت غلق الإختبار:</span>{' '}
              {systemExam.endsAt ? formatDate(systemExam.endsAt) : 'لا يوجد'}{' '}
              {!systemExam.endsAt || systemExam.endsAt > new Date() ? (
                <Badge>مفتوح</Badge>
              ) : (
                <Badge variant='destructive'>مغلق</Badge>
              )}
            </div>
          </div>
          <h3 className='mb-2 mt-4 text-xl font-bold'>إحصائيات</h3>
          <div className='flex items-center justify-around'>
            <div className='flex flex-col items-center justify-center'>
              <CircularProgress percent={submittedQuizPercentage} />
              <p>نسبة المختبرين</p>
            </div>
            {avgStats.percentageAvg === null ? (
              <p>لم يتم حساب متوسط الدرجات</p>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <CircularProgress percent={Number(avgStats.percentageAvg)} />
                <p>متوسط الدرجات (نسبة)</p>
              </div>
            )}
          </div>
          <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 shadow'>
              <p className='text-xl font-semibold'>{quizCount}</p>
              <p>عدد المستحقين للإختبار</p>
            </div>
            <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 shadow'>
              <p className='text-xl font-semibold'>{submittedQuizCount}</p>
              <p>عدد المختبرين</p>
            </div>
            <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 shadow'>
              <p className='text-xl font-semibold'>
                {avgStats.gradeAvg === null
                  ? 'لم يتم حسابها'
                  : `${Number(avgStats.gradeAvg).toFixed(2)}/${
                      quizzes?.[0]?.total
                    }`}
              </p>
              <p>متوسط الدرجات</p>
            </div>
          </div>
        </div>
        <DataTableActions
          excelExport={{
            handle: handleDownload,
            data: { disabled: !quizzes || quizzes.length === 0 },
          }}
        />
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

  const id = ctx.params!.id as string

  const systemExam = await db
    .selectFrom('SystemExam')
    .leftJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
    .leftJoin('Curriculum', 'SystemExam.curriculumId', 'Curriculum.id')
    .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
    .leftJoin('Course', 'Track.courseId', 'Course.id')
    .selectAll('SystemExam')
    .select([
      'Course.name as courseName',
      'Curriculum.name as curriculumName',
      'Cycle.name as cycleName',
    ])
    .where('SystemExam.id', '=', id)
    .executeTakeFirst()

  if (!systemExam) return { notFound: true }

  const quizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .executeTakeFirst()
    )?.total
  )

  const submittedQuizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .where('submittedAt', 'is not', null)
        .executeTakeFirst()
    )?.total
  )

  const submittedQuizPercentage = (submittedQuizCount / quizCount) * 100

  const avgStats = await db
    .selectFrom('Quiz')
    .select(({ fn }) => [
      fn.avg('grade').as('gradeAvg'),
      fn.avg('percentage').as('percentageAvg'),
    ])
    .where('systemExamId', '=', id)
    .where('correctedAt', 'is not', null)
    .executeTakeFirst()

  return {
    props: {
      session,
      systemExam,
      quizCount,
      submittedQuizCount,
      submittedQuizPercentage,
      avgStats,
    },
  }
}
export default ExamsPage
