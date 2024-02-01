import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { Curriculum, CurriculumPart, Track } from '~/kysely/types'
import {
  ColumnFiltersState,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Filter, Trash, Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { NewCurriculumDialog } from '~/components/modals/new-curriculum'
import { EditCurriculumDialog } from '~/components/modals/edit-curriculum'
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
import { Combobox } from '~/components/ui/combobox'
import { DataTable } from '~/components/ui/data-table'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { toast } from 'sonner'
import { api } from '~/utils/api'
import { getColumnFilters } from '~/utils/getColumnFilters'
import { Checkbox } from '~/components/ui/checkbox'
import { Selectable } from 'kysely'
import { deleteRows } from '~/utils/client/deleteRows'
import { DataTableActions } from '~/components/ui/data-table-actions'

const DeleteCurriculumDialog = ({ id }: { id: string }) => {
  const curriculumDelete = api.curriculum.delete.useMutation()

  const utils = api.useUtils()

  const deleteCurriculum = () => {
    const promise = curriculumDelete.mutateAsync(id).finally(() => {
      utils.curriculum.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف المنهج...',
      success: 'تم حذف المنهج بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
        <AlertDialogDescription>
          هل تريد حقاً حذف هذا المنهج؟ هذا سيحذف الإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
        <AlertDialogAction onClick={deleteCurriculum}>تأكيد</AlertDialogAction>
      </AlertDialogFooter>
    </>
  )
}

type RowType = Selectable<Curriculum> & {
  track: Track & { course: { name: string } }
  parts: CurriculumPart[]
}

const columnFiltersValidators = {
  trackId: z.string(),
}

const columnHelper = createColumnHelper<any>()

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
  columnHelper.accessor('name', {
    header: 'المنهج',
    meta: {
      textAlign: 'center',
    },
  }),
  columnHelper.accessor((row) => `${row.courseName}: ${row.trackName}`, {
    id: 'trackId',
    header: ({ column }) => {
      const { data: tracks, isLoading } = api.track.list.useQuery({
        include: { course: true },
      })

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          المسار
          <Popover>
            <PopoverTrigger className='mr-4' asChild>
              <Button size='icon' variant={filterValue ? 'secondary' : 'ghost'}>
                <Filter className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Combobox
                items={[
                  { name: 'الكل', id: '' },
                  ...(tracks?.map((t) => ({
                    ...t,
                    name: `${t.courseName}: ${t.name}`,
                  })) || []),
                ]}
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
          {/* <Button variant='primary'>عرض المناهج</Button> */}
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
              <EditCurriculumDialog
                id={row.original.id as unknown as string}
                setDialogOpen={setDialogOpen}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='icon' className='hover:bg-red-50'>
                <Trash className='h-4 w-4 text-red-600' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <DeleteCurriculumDialog
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
]

const PAGE_SIZE = 25

const CurriculaPage = () => {
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

  const bulkDeleteMutation = api.curriculum.bulkDelete.useMutation()
  const deleteAllMutation = api.curriculum.deleteAll.useMutation()

  const invalidate = utils.curriculum.invalidate

  const columnFilters = getColumnFilters(router.query, columnFiltersValidators)
  const filters = columnFilters.reduce(
    (obj, f) => ({ ...obj, [f.id]: f.value }),
    {}
  )

  const { data: curricula, isFetching: isFetchingCurricula } =
    api.curriculum.list.useQuery(
      {
        pagination,
        include: { track: true },
        filters,
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.curriculum.count.useQuery({ filters }, { networkMode: 'always' })

  const pageCount =
    curricula !== undefined && typeof count === 'number'
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: (curricula as any[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    state: { pagination, columnFilters, rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    manualFiltering: true,
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
        <title>المناهج</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المناهج</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              إضافة منهج
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewCurriculumDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: !curricula || curricula?.length === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={isFetchingCurricula} />
    </>
  )
}

CurriculaPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default CurriculaPage
