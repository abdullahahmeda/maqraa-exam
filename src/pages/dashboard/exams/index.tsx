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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { FileCheck2, ListChecks, Trash } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { formatDate } from '~/utils/formatDate'

type Row = Exam & {
  student: User | null
  corrector: User | null
  questions: {
    id: number
  }[]
  course: Course
  curriculum: Curriculum
}

const DeleteExamDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const examDelete = api.exams.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteExam = () => {
    const t = toast({ title: 'جاري حذف الإمتحان' })
    examDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الإمتحان بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['exams']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا الإمتحان</AlertDialogTitle>
        <AlertDialogDescription>
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteExam}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

const columnHelper = createColumnHelper<Row>()

const columns = [
  columnHelper.accessor('student.name', {
    header: 'الطالب',
    cell: (info) => info.getValue() || '-',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('student.email', {
    header: 'الإيميل',
    cell: (info) => info.getValue() || '-',
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
  // columnHelper.accessor('grade', {
  //   header: 'الدرجة',
  //   cell: (info) => (
  //     <Badge
  //     // variant={info.getValue() !== null ? 'primary' : 'warning'}
  //     >
  //       {info.getValue() === null
  //         ? 'لم يتم التصحيح'
  //         : `${info.getValue()} من ${
  //             info.row.original.questions.length
  //           } (${percentage(
  //             info.getValue() as number,
  //             info.row.original.questions.length
  //           )}%)`}
  //     </Badge>
  //   ),
  //   meta: {
  //     className: 'text-center',
  //   },
  // }),
  columnHelper.accessor('createdAt', {
    header: 'وقت البدأ',
    cell: (info) => formatDate(info.getValue()),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('submittedAt', {
    header: 'وقت التسليم',
    cell: (info) =>
      info.getValue() ? (
        formatDate(info.getValue())
      ) : (
        <Badge variant='destructive'>لم يتم التسليم</Badge>
      ),
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor('correctedAt', {
    header: 'وقت التصحيح',
    cell: (info) =>
      info.getValue() ? (
        formatDate(info.getValue())
      ) : (
        <Badge variant='destructive'>لم يتم التصحيح</Badge>
      ),
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
        {!!row.original.submittedAt && (
          <Link
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            href={`/dashboard/exams/${row.original.id}`}
          >
            <FileCheck2 className='h-4 w-4 text-success' />
          </Link>
        )}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteExamDialog id={row.original.id} />
          </AlertDialogContent>
        </AlertDialog>
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

  const { data: exams, isFetching } = api.exams.findMany.useQuery<any, Row[]>(
    {
      skip: pageIndex * pageSize,
      take: pageSize,
      include: {
        student: true,
        curriculum: true,
        course: true,
        corrector: true,
      },
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.exams.count.useQuery(
    undefined,
    { networkMode: 'always' }
  )

  const pageCount =
    exams !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
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
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Head>
        <title>الإختبارات</title>
      </Head>
      <div>
        <div className='mb-2 flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>الإختبارات</h2>
          <Button>إضافة إختبار نظام</Button>
        </div>
        <DataTable table={table} fetching={isFetching} />
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
