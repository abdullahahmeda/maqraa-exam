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
import { checkRead } from '~/server/api/routers/custom/helper'
import { enhance } from '@zenstackhq/runtime'
import { prisma as _prisma } from '~/server/db'
import { EditQuizDialog } from '~/components/modals/edit-quiz'
import { percentage } from '~/utils/percentage'
import { useToast } from '~/components/ui/use-toast'
import { saveAs } from 'file-saver'
import { CircularProgress } from '~/components/ui/circular-progress'

type Row = Quiz & {
  examinee: User
  corrector: User | null
}

const columnHelper = createColumnHelper<Row>()

const PAGE_SIZE = 50

const ExamsPage = ({
  systemExam,
  quizCount,
  submittedQuizCount,
  submittedQuizPercentage,
  avgStats,
}: {
  systemExam: SystemExam & {
    cycle: Cycle
    curriculum: Curriculum & { track: { course: Course } }
  }
}) => {
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

  const columns = [
    columnHelper.accessor('examinee.name', {
      header: 'الطالب',
      cell: (info) => info.getValue() || '-',
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('examinee.email', {
      header: 'الإيميل',
      cell: (info) => info.getValue() || '-',
      meta: {
        className: 'text-center',
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
    columnHelper.accessor('enteredAt', {
      header: 'وقت البدأ',
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as Date) : '-',
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('submittedAt', {
      header: 'وقت التسليم',
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as Date) : '-',
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('correctedAt', {
      header: 'وقت التصحيح',
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as Date) : '-',
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('corrector.name', {
      header: 'المصحح',
      cell: (info) => info.getValue() || '-',
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <div className='flex justify-center gap-2'>
          {session?.user.role !== 'STUDENT' ? (
            <>
              {!!row.original.submittedAt && (
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' })
                  )}
                  href={`/dashboard/quizzes/${row.original.id}`}
                >
                  <FileCheck2 className='h-4 w-4 text-success' />
                </Link>
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
                    <Trash className='h-4 w-4 text-red-600' />
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
                (row.original.endsAt && row.original.endsAt > new Date())) &&
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
  ]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'systemExamId',
      value: router.query.id as string,
    },
  ])

  const filters = columnFilters.map((filter) => {
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: quizzes, isFetching } = api.quiz.findMany.useQuery(
    {
      skip: pageIndex * pageSize,
      take: pageSize,
      include: {
        examinee: true,
        corrector: true,
      },
      where: { AND: filters },
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.quiz.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const quizzesExport = api.exportQuizzes.useMutation()

  const pageCount =
    quizzes !== undefined && typeof count === 'number'
      ? Math.ceil((count as number) / pageSize)
      : -1

  const table = useReactTable({
    data: (quizzes as Row[]) || [],
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

  const handleDownload = async () => {
    const t = toast({ title: 'يتم تجهيز الملف للتحميل...' })
    quizzesExport
      .mutateAsync({ systemExamId: systemExam.id })
      .then((arrayBuffer) => {
        const content = new Blob([arrayBuffer])
        saveAs(content, `الإختبار ${systemExam.name}.xlsx`)
        toast({ title: 'تم بدأ تحميل الملف' })
      })
      .catch(() => {
        toast({ title: 'حدث خطأ أثناء تحميل الملف' })
      })
      .finally(() => {
        t.dismiss()
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
            <p>اسم الإختبار: {systemExam.name}</p>
            <p>نوع الإختبار: {enTypeToAr(systemExam.type)}</p>
            <p>الدورة: {systemExam.cycle.name}</p>
            <p>المقرر: {systemExam.curriculum.track.course.name}</p>
            <p>المنهج: {systemExam.curriculum.name}</p>
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
              <CircularProgress percent={submittedQuizPercentage} />
              <p>نسبة المختبرين</p>
            </div>
            <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 shadow'>
              <p className='text-xl font-semibold'>
                {avgStats._avg.grade === null
                  ? 'لم يتم حسابها'
                  : avgStats._avg.grade}
              </p>
              <p>متوسط الدرجات</p>
            </div>
            <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 shadow'>
              {avgStats._avg.percentage === null ? (
                <p className='text-xl font-semibold '>لم يتم حسابها</p>
              ) : (
                <CircularProgress percent={avgStats._avg.percentage} />
              )}
              <p>متوسط الدرجات (نسبة)</p>
            </div>
          </div>
        </div>
        <Button
          disabled={!quizzes || quizzes.length === 0}
          variant='success'
          className='mb-4 flex gap-2'
          onClick={handleDownload}
        >
          <Download className='h-4 w-4' />
          تصدير
        </Button>
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

  const prisma = enhance(_prisma, { user: session.user })

  const systemExam = await checkRead(
    prisma.systemExam.findFirst({
      where: { id },
      include: {
        cycle: true,
        curriculum: { include: { track: { select: { course: true } } } },
      },
    })
  )

  if (!systemExam) return { notFound: true }

  const quizCount = await checkRead(
    prisma.quiz.count({ where: { systemExamId: id } })
  )
  const submittedQuizCount = await checkRead(
    prisma.quiz.count({
      where: { systemExamId: id, submittedAt: { not: null } },
    })
  )

  const submittedQuizPercentage = (submittedQuizCount / quizCount) * 100

  const avgStats = await checkRead(
    prisma.quiz.aggregate({
      _avg: {
        grade: true,
        percentage: true,
      },
      where: { systemExamId: id, correctedAt: { not: null } },
    })
  )

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
