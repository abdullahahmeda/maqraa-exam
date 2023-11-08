import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Curriculum, CurriculumPart, Track } from '~/kysely/types'
import { useQueryClient } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Filter, Trash, Plus } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { AddCurriculumDialog } from '~/components/modals/add-curriculum'
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
import { useToast } from '~/components/ui/use-toast'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'
import { getColumnFilters } from '~/utils/getColumnFilters'

const DeleteCurriculumDialog = ({ id }: { id: string }) => {
  const curriculumDelete = api.curriculum.delete.useMutation()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const deleteCurriculum = () => {
    const t = toast({ title: 'جاري حذف المنهج' })
    curriculumDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف المنهج بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['curriculum']])
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

type RowType = Curriculum & {
  track: Track & { course: { name: string } }
  parts: CurriculumPart[]
}

const columnFiltersValidators = {
  trackId: z.string(),
}

const columnHelper = createColumnHelper<RowType>()

const columns = [
  columnHelper.accessor('name', {
    header: 'المنهج',
    meta: {
      className: 'text-center',
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
      className: 'text-center',
    },
  }),
  // columnHelper.accessor('parts', {
  //   header: 'المقدار',
  //   cell: ({ row }) =>
  //     row.original.parts.map((part) => (
  //       <div key={part.id}>
  //         {part.name}: من الحديث {part.from} إلى {part.to} ({part.from}-
  //         {part.mid}، {Math.min(part.mid + 1, part.to)}-{part.to})
  //       </div>
  //     )),
  //   meta: {
  //     className: 'text-center',
  //   },
  // }),
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
                id={row.original.id}
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
              <DeleteCurriculumDialog id={row.original.id} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
    meta: {
      className: 'text-center',
    },
  }),
]

const PAGE_SIZE = 25

const CurriculaPage = () => {
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
    data: curricula || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    state: { pagination, columnFilters },
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
            <AddCurriculumDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable table={table} fetching={isFetchingCurricula} />
    </>
  )
}

CurriculaPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default CurriculaPage
