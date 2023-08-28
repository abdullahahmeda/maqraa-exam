import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Cycle, UserRole } from '@prisma/client'
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
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'
import { Plus } from 'lucide-react'

const columnHelper = createColumnHelper<Cycle>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
            <EditCycleDialog id={row.original.id} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteCycleDialog id={row.original.id} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const CyclesPage = () => {
  const router = useRouter()

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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const filters = columnFilters.map((filter) => {
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: cycles, isFetching: isFetchingCycles } =
    api.cycles.findMany.useQuery(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        where: { AND: filters },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.cycles.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    cycles !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: cycles || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, columnFilters },
    manualFiltering: true,
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
        <title>الدورات</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>الدورات</h2>
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
      <DataTable table={table} fetching={isFetchingCycles} />
    </>
  )
}

CyclesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== UserRole.ADMIN) return { notFound: true }

  return {
    props: {
      session,
    },
  }
}

export default CyclesPage
