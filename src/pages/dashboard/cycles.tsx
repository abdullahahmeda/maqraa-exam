import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { Cycle } from '~/kysely/types'
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { PencilIcon, EyeIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { NewCycleDialog } from '~/components/modals/new-cycle'
import { DeleteCycleDialog } from '~/components/modals/delete-cycle'
import { EditCycleDialog } from '~/components/modals/edit-cycle'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { api } from '~/utils/api'
import { PlusIcon } from 'lucide-react'
import { Checkbox } from '~/components/ui/checkbox'
import { deleteRows } from '~/utils/client/deleteRows'
import { Selectable } from 'kysely'
import { DataTableActions } from '~/components/ui/data-table-actions'

const columnHelper = createColumnHelper<Selectable<Cycle>>()

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
          <EyeIcon className='h-4 w-4' />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='hover:bg-orange-50'>
              <PencilIcon className='h-4 w-4 text-orange-500' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EditCycleDialog id={row.original.id as unknown as string} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
              <TrashIcon className='h-4 w-4 text-red-600' />
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
  const utils = api.useUtils()
  const router = useRouter()
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

  const bulkDeleteMutation = api.cycle.bulkDelete.useMutation()
  const deleteAllMutation = api.cycle.deleteAll.useMutation()

  const invalidate = utils.cycle.invalidate

  const { data: cycles, isFetching: isFetchingCycles } =
    api.cycle.list.useQuery({ pagination }, { networkMode: 'always' })

  const pageCount =
    cycles?.data !== undefined && typeof cycles?.count === 'number'
      ? Math.ceil(cycles!.count / pageSize)
      : -1

  const table = useReactTable({
    data: (cycles?.data as any[]) || [],
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
        <title>الدورات</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الدورات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <PlusIcon className='h-4 w-4' />
              إضافة دورة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewCycleDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: cycles?.count === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={isFetchingCycles} />
    </>
  )
}

CyclesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default CyclesPage
