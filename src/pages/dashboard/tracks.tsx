import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Track } from '~/kysely/types'
import {
  ColumnFiltersState,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Filter, Trash } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { AddTrackDialog } from '~/components/modals/add-track'
import { DeleteTrackDialog } from '~/components/modals/delete-track'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Combobox } from '~/components/ui/combobox'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'
import { Plus } from 'lucide-react'
import { getColumnFilters } from '~/utils/getColumnFilters'
import { Checkbox } from '~/components/ui/checkbox'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'

const columnFiltersValidators = {
  courseId: z.string(),
}
const columnHelper = createColumnHelper<Track & { courseName: string }>()

const columns = [
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
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  columnHelper.accessor('name', { header: 'المسار' }),
  columnHelper.accessor('courseName', {
    id: 'courseId',
    header: ({ column }) => {
      const { data: courses, isLoading } = api.course.list.useQuery({})

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          المقرر
          <Popover>
            <PopoverTrigger className='mr-4' asChild>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Combobox
                items={[{ name: 'الكل', id: '' }, ...(courses || [])]}
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
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Button size='icon' variant='ghost'>
          <Eye className='h-4 w-4' />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size='icon' variant='ghost' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteTrackDialog id={row.original.id as unknown as string} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const TracksPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
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

  const bulkDelete = api.track.bulkDelete.useMutation()

  const columnFilters = getColumnFilters(router.query, columnFiltersValidators)
  const filters = columnFilters.reduce(
    (obj, f) => ({ ...obj, [f.id]: f.value }),
    {}
  )

  const { data: tracks, isFetching: isFetchingTracks } =
    api.track.list.useQuery(
      {
        pagination,
        include: { course: true },
        filters,
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.track.count.useQuery(
    { filters },
    { networkMode: 'always' }
  )

  const pageCount =
    tracks !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: (tracks as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, columnFilters, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualFiltering: true,
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
    if (selectedRows.length === 0) return
    const t = toast({ title: 'جاري حذف المسارات المختارة...' })
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
        queryClient.invalidateQueries([['track']])
      })
  }

  return (
    <>
      <Head>
        <title>المسارات</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المسارات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة مسار
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddTrackDialog setDialogOpen={setDialogOpen} />
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
                هل تريد حقاً حذف المسارات المختارة؟
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              سيتم حذف {selectedRows.length} من المسارات
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
      <DataTable table={table} fetching={isFetchingTracks} />
    </>
  )
}

TracksPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default TracksPage
