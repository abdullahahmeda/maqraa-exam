import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Cycle, Question } from '@prisma/client'
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
import { Trash } from 'lucide-react'
import { DataTable } from '~/components/ui/data-table'
import { Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'
import { newCycleSchema } from '~/validation/newCycleSchema'
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

type FieldValues = { name: string }

const AddCycleDialog = () => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(newCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const cycleCreate = api.cycles.create.useMutation()

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري إضافة الأسئلة' })
    cycleCreate
      .mutateAsync(data as z.infer<typeof newCycleSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة الأسئلة بنجاح' })
        // closeModal()
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['cycles']])
      })
  }

  return (
    <>
      <DialogHeader>إضافة دورة</DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الدورة</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type='submit'
              // variant='success'
              loading={cycleCreate.isLoading}
            >
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

const DeleteCycleDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const cycleDelete = api.cycles.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteCycle = () => {
    const t = toast({ title: 'جاري حذف الدورة' })
    cycleDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الدورة بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['cycles']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المقرر؟</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteCycle}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

type Props = {
  page: number
}

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
  columnHelper.accessor('name', { header: 'الاسم' }),
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
            <Button variant='ghost' size='icon'>
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

const CyclesPage = ({ page: initialPage }: Props) => {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE,
    }),
    [pageIndex, pageSize]
  )

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
    cycles !== undefined && count !== undefined
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
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
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
        <title>الدورات</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>الدورات</h2>
        <Dialog>
          <DialogTrigger>
            <Button>إضافة دورة</Button>
          </DialogTrigger>
          <DialogContent>
            <AddCycleDialog />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable table={table} fetching={isFetchingCycles} />
    </>
  )
}

CyclesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default CyclesPage
