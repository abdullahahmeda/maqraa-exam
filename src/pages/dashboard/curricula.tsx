import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Course, Curriculum } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { useQueryClient } from '@tanstack/react-query'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
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
import { DataTable } from '~/components/ui/data-table'
import { Combobox } from '~/components/ui/combobox'
import { useToast } from '~/components/ui/use-toast'
import { Trash } from 'lucide-react'

type FieldValues = {
  trackId: string
  name: string
  fromPage: number
  toPage: number
}

const AddCurriculumDialog = () => {
  const queryClient = useQueryClient()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newCurriculumSchema),
  })
  const curriculumCreate = api.curricula.create.useMutation()

  const { toast } = useToast()

  const { data: tracks, isLoading: isTracksLoading } =
    api.tracks.findMany.useQuery()

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري إضافة المنهج' })
    curriculumCreate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المنهج بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['curricula']])
      })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='trackId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المقرر</FormLabel>
              <FormControl>
                <Combobox
                  items={tracks || []}
                  loading={isTracksLoading}
                  value={field.value}
                  labelKey='name'
                  valueKey='id'
                  onSelect={field.onChange}
                  triggerText='اختر المقرر'
                  triggerClassName='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='fromPage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>من صفحة</FormLabel>
                <FormControl>
                  <Input type='number' min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='toPage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>إلى صفحة</FormLabel>
                <FormControl>
                  <Input type='number' min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type='submit' loading={curriculumCreate.isLoading}>
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const DeleteCurriculumDialog = ({ id }: { id: string }) => {
  const curriculumDelete = api.curricula.delete.useMutation()

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
        queryClient.invalidateQueries([['curricula']])
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

type Props = {
  page: number
}

type RowType = Curriculum & { track: { name: string } }

const columnHelper = createColumnHelper<RowType>()

const PAGE_SIZE = 50

const CurriculaPage = ({ page: initialPage }: Props) => {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE,
    }),
    [pageSize, pageIndex]
  )

  const { data: curricula, isFetching: isFetchingCurricula } =
    api.curricula.findMany.useQuery<any, RowType[]>(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        include: { track: true },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.cycles.count.useQuery(
    undefined,
    // { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    curricula !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('track.name', {
        header: 'المسار',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.display({
        id: 'pages',
        header: 'الصفحات',
        cell: ({ row }) =>
          'من ' + row.original.fromPage + ' إلى ' + row.original.toPage,
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            {/* <Button variant='primary'>عرض المناهج</Button> */}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant='ghost'>
                  <Trash className='h-4 w-4 text-red-600' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteCurriculumDialog id={row.original.id} />
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
    data: curricula || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  useEffect(() => {
    router.query.page = `${pageIndex + 1}`
    router.push(router)
  }, [pageIndex])

  useEffect(() => {
    setPagination((pagination) => ({
      ...pagination,
      pageIndex: Number(router.query.page) - 1,
    }))
  }, [router.query.page])

  return (
    <>
      <Head>
        <title>المناهج</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المناهج</h2>
        <Dialog>
          <DialogTrigger>
            <Button>إضافة منهج</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>إضافة منهج</DialogHeader>
            <AddCurriculumDialog />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default CurriculaPage
