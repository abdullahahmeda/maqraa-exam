import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldPath, UseFormReturn, useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Cycle, Question, UserRole } from '@prisma/client'
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
import { Edit, Loader2, Trash } from 'lucide-react'
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
import { editCycleSchema } from '~/validation/editCycleSchema'
import { getServerAuthSession } from '~/server/auth'

type CreateFieldValues = { name: string }
type UpdateFieldValues = { id: string } & CreateFieldValues

const CycleForm = <T extends CreateFieldValues | UpdateFieldValues>({
  form,
  onSubmit,
  loading = false,
  submitText,
}: {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  loading?: boolean
  submitText: string
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name={'name' as FieldPath<T>}
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
            loading={loading}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const AddCycleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<CreateFieldValues>({
    resolver: zodResolver(newCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const cycleCreate = api.cycles.create.useMutation()

  const onSubmit = (data: CreateFieldValues) => {
    const t = toast({ title: 'جاري إضافة الدورة' })
    cycleCreate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة الدورة بنجاح' })
        setDialogOpen(false)
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
    <CycleForm
      form={form}
      loading={cycleCreate.isLoading}
      submitText='إضافة'
      onSubmit={onSubmit}
    />
  )
}

const EditCycleDialog = ({ id }: { id: string }) => {
  const form = useForm<UpdateFieldValues>({
    resolver: zodResolver(editCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data: cycle,
    isLoading,
    error,
  } = api.cycles.findFirstOrThrow.useQuery({ where: { id } })

  useEffect(() => {
    if (cycle) form.reset(cycle)
  }, [cycle])

  const cycleUpdate = api.cycles.update.useMutation()

  const onSubmit = (data: UpdateFieldValues) => {
    const t = toast({ title: 'جاري تعديل الدورة' })
    cycleUpdate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم تعديل الدورة بنجاح' })
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

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <CycleForm
      form={form}
      onSubmit={onSubmit}
      loading={cycleUpdate.isLoading}
      submitText='تعديل'
    />
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
          <DialogTrigger>
            <Button variant='ghost' size='icon' className='hover:bg-orange-50'>
              <Edit className='h-4 w-4 text-orange-500' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>تعديل المقرر</DialogHeader>
            <EditCycleDialog id={row.original.id} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger>
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
          <DialogTrigger>
            <Button>إضافة دورة</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>إضافة دورة</DialogHeader>
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
