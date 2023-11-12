import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Cycle } from '~/kysely/types'
import {
  ColumnFiltersState,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Eye, Trash } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { AddCycleDialog } from '~/components/modals/add-cycle'
import { DeleteCycleDialog } from '~/components/modals/delete-cycle'
import { EditCycleDialog } from '~/components/modals/edit-cycle'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'
import { Plus } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Checkbox } from '~/components/ui/checkbox'

const columnHelper = createColumnHelper<Cycle>()

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
  columnHelper.accessor('name', { header: 'الدورة' }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-center'>
        {/* <Button>عرض</Button> */}
        <Button size='icon' variant='ghost'>
          <Eye className='h-4 w-4' />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='hover:bg-orange-50'>
              <Pencil className='h-4 w-4 text-orange-500' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EditCycleDialog id={row.original.id as unknown as string} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteCycleDialog id={row.original.id as unknown as string} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const CyclesPage = () => {
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

  const bulkDelete = api.cycle.bulkDelete.useMutation()

  const { data: cycles, isFetching: isFetchingCycles } =
    api.cycle.list.useQuery({ pagination }, { networkMode: 'always' })

  const { data: count, isLoading: isCountLoading } = api.cycle.count.useQuery(
    undefined,
    { networkMode: 'always' }
  )

  const pageCount =
    cycles !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: (cycles as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
    const t = toast({ title: 'جاري حذف الدورات المختارة...' })
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
        queryClient.invalidateQueries([['cycle']])
      })
  }

  return (
    <>
      <Head>
        <title>الدورات</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الدورات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة دورة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddCycleDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className='mb-4'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              // onClick={handleBulkDelete}
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
                هل تريد حقاً حذف الدورات المختارة؟
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              سيتم حذف {selectedRows.length} من الدورات
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
      <DataTable table={table} fetching={isFetchingCycles} />
    </>
  )
}

CyclesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default CyclesPage
