import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Course } from '~/kysely/types'
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
import { Checkbox } from '~/components/ui/checkbox'

const DeleteCourseDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const courseDelete = api.course.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteCourse = () => {
    const t = toast({ title: 'جاري حذف المقرر' })
    courseDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف المقرر بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['course']])
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
        <AlertDialogAction onClick={deleteCourse}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

const columnHelper = createColumnHelper<Course>()

const PAGE_SIZE = 25

const CoursesPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

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

  const bulkDelete = api.course.bulkDelete.useMutation()

  const {
    data: courses,
    isFetching: isFetchingCourses,
    refetch,
  } = api.course.list.useQuery({ pagination }, { networkMode: 'always' })

  const { data: count, isLoading: isCountLoading } = api.course.count.useQuery(
    undefined,
    { networkMode: 'always' }
  )

  const pageCount =
    courses !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

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
        header: 'المقرر',
        meta: {
          className: 'text-center',
        },
      }),
      // columnHelper.accessor('questions', {
      //   header: 'عدد الأسئلة',
      //   meta: {
      //     className: 'text-center',
      //   },
      //   cell: (info) => info.getValue().length,
      // }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: function Cell({ row }) {
          const [dialogOpen, setDialogOpen] = useState(false)
          return (
            <div className='flex justify-center gap-2'>
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
                  <EditCourseDialog id={row.original.id as unknown as string} />
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
                  <DeleteCourseDialog
                    id={row.original.id as unknown as string}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
        meta: {
          className: 'text-center',
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: (courses as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
  })

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((item) => item.original)

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    const t = toast({ title: 'جاري حذف المقررات المختارة...' })
    bulkDelete
      .mutateAsync(selectedRows.map(({ id }) => id) as unknown as string[])
      .then(() => {
        toast({ title: 'تم الحذف بنجاح' })
        setRowSelection({})
      })
      .catch((e) => {
        toast({ title: 'حدث خطأ أثناء الحذف' })
      })
      .finally(() => {
        t.dismiss()
        queryClient.invalidateQueries([['course']])
      })
  }

  return (
    <>
      <Head>
        <title>المقررات</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المقررات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة مقرر
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddCourseDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className='mb-4'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              disabled={selectedRows.length === 0}
            >
              <Trash size={16} />
              حذف{' '}
              {selectedRows.length > 0 && `(${selectedRows.length} من العناصر)`}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                هل تريد حقاً حذف المقررات المختارة؟
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              سيتم حذف {selectedRows.length} من المقررات
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleBulkDelete}>
                تأكيد
              </AlertDialogAction>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <DataTable table={table} fetching={isFetchingCourses} />
    </>
  )
}

CoursesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default CoursesPage
