import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { ErrorReport, UserRole, Question } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Trash, Plus } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { AddCourseDialog } from '~/components/modals/add-course'
import { EditCourseDialog } from '~/components/modals/edit-course'
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
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { useToast } from '~/components/ui/use-toast'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'

const DeleteErrorReportDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const errorReportDelete = api.errorReport.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteErrorReport = () => {
    const t = toast({ title: 'جاري حذف البلاغ' })
    errorReportDelete
      .mutateAsync({
        where: { id },
      })
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف البلاغ بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['errorReport']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المقرر؟</AlertDialogTitle>
        <AlertDialogDescription>
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteErrorReport}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

const columnHelper = createColumnHelper<ErrorReport & { question: Question }>()

const PAGE_SIZE = 25

const CoursesPage = () => {
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

  const { data: errorReports, isFetching: isFetchingErrorReports } =
    api.errorReport.findMany.useQuery(
      {
        take: pageSize,
        skip: pageIndex * pageSize,
        include: { question: true },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.errorReport.count.useQuery({}, { networkMode: 'always' })

  const pageCount =
    errorReports !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'اسم المبلغ',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('email', {
        header: 'البريد الإلكتروني',
        meta: {
          className: 'text-center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('question.number', {
        header: 'رقم السؤال',
        meta: {
          className: 'text-center',
        },
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            {/* <Button>عرض المناهج</Button> */}
            <Dialog>
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
                <EditCourseDialog id={row.original.id} />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='ghost' size='icon' className='hover:bg-red-50'>
                  <Trash className='h-4 w-4 text-red-600' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteErrorReportDialog id={row.original.id} />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
        meta: {
          className: 'text-center',
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: errorReports || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination },
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
  })

  return (
    <>
      <Head>
        <title>تبليغات الأخطاء</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>تبليغات الأخطاء</h2>
        {/*<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة مقرر
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddCourseDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>*/}
      </div>
      <DataTable table={table} fetching={isFetchingErrorReports} />
    </>
  )
}

CoursesPage.getLayout = (page: any) => (
  <DashboardLayout>{page} </DashboardLayout>
)

export default CoursesPage
