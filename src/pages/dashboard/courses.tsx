import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { Course } from '~/kysely/types'
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Trash, Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { NewCourseDialog } from '~/components/modals/new-course'
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
import { toast } from 'sonner'
import { api } from '~/utils/api'
import { Checkbox } from '~/components/ui/checkbox'
import { deleteRows } from '~/utils/client/deleteRows'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { Selectable } from 'kysely'

const DeleteCourseDialog = ({ id }: { id: string }) => {
  const deleteMutation = api.course.delete.useMutation()
  const utils = api.useUtils()

  const deleteCourse = () => {
    const promise = deleteMutation.mutateAsync(id).finally(() => {
      utils.course.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف المقرر...',
      success: 'تم حذف المقرر بنجاح',
      error: (error) => error.message,
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

const columnHelper = createColumnHelper<Selectable<Course>>()

const PAGE_SIZE = 25

const CoursesPage = () => {
  const router = useRouter()
  const utils = api.useUtils()
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

  const bulkDeleteMutation = api.course.bulkDelete.useMutation()
  const deleteAllMutation = api.course.deleteAll.useMutation()
  const invalidate = utils.course.invalidate

  const { data: courses, isFetching: isFetchingCourses } =
    api.course.list.useQuery({ pagination }, { networkMode: 'always' })

  const pageCount =
    courses?.data !== undefined && typeof courses?.count === 'number'
      ? Math.ceil(courses?.count / pageSize)
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
          textAlign: 'center',
        },
      }),
      // columnHelper.accessor('questions', {
      //   header: 'عدد الأسئلة',
      //   meta: {
      //     textAlign: 'center',
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
          textAlign: 'center',
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: (courses?.data as any[]) || [],
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
            <NewCourseDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: courses?.count === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={isFetchingCourses} />
    </>
  )
}

CoursesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default CoursesPage
