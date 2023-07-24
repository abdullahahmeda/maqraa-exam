import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Question, Track, UserRole } from '@prisma/client'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Checkbox } from '~/components/ui/checkbox'
import { Filter, Trash } from 'lucide-react'
import { DataTable } from '~/components/ui/data-table'
import { Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'
import { newTrackSchema } from '~/validation/newTrackSchema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
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
import { Combobox } from '~/components/ui/combobox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { getServerAuthSession } from '~/server/auth'

type FieldValues = { name: string; courseId: string }

const AddTrackDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(newTrackSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const trackCreate = api.tracks.create.useMutation()
  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.findMany.useQuery()

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري إضافة المسار' })
    trackCreate
      .mutateAsync(data as z.infer<typeof newTrackSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المسار بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['tracks']])
      })
  }

  return (
    <>
      <DialogHeader>إضافة مسار</DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المسار</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='courseId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>المقرر</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger loading={isCoursesLoading}>
                      <SelectValue placeholder='اختر المقرر' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type='submit'
              // variant='success'
              loading={trackCreate.isLoading}
            >
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

const DeleteTrackDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const trackDelete = api.tracks.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteCourse = () => {
    const t = toast({ title: 'جاري حذف المسار' })
    trackDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف المسار بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['tracks']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المسار</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteCourse}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<Track & { course: { name: string } }>()

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
  columnHelper.accessor('name', { header: 'المسار' }),
  columnHelper.accessor('course.name', {
    id: 'course',
    header: ({ column }) => {
      const { data: courses, isLoading } = api.courses.findMany.useQuery()

      const filterValue = column.getFilterValue() as string | undefined

      return (
        <div className='flex items-center'>
          المقرر
          <Popover>
            <PopoverTrigger className='mr-4'>
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
        {/* <Button>عرض</Button> */}
        <Button size='icon' variant='ghost'>
          <Eye className='h-4 w-4' />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button size='icon' variant='ghost' className='hover:bg-red-50'>
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <DeleteTrackDialog id={row.original.id} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
]

const PAGE_SIZE = 25

const TracksPage = () => {
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
    if (filter.id === 'course')
      return { courseId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: tracks, isFetching: isFetchingTracks } =
    api.tracks.findMany.useQuery<any, (Track & { course: { name: string } })[]>(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        where: { AND: filters },
        include: { course: true },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.tracks.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    tracks !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const table = useReactTable({
    data: tracks || [],
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
        <title>المسارات</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المسارات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>إضافة مسار</Button>
          </DialogTrigger>
          <DialogContent>
            <AddTrackDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable table={table} fetching={isFetchingTracks} />
    </>
  )
}

TracksPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== UserRole.ADMIN) return { notFound: true }

  return {
    props: {
      session,
    },
  }
}

export default TracksPage
