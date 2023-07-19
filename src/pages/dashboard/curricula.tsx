import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FieldPath,
  UseFormReturn,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Course, Curriculum, Part, Track } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
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
import { Edit, Filter, Loader2, Trash } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'

type CreateFieldValues = {
  trackId: string
  name: string
  parts: {
    name: string
    number: number | string
    from: number | string
    to: number | string
  }[]
}
type UpdateFieldValues = CreateFieldValues & { id: string }

const CurriculumForm = <T extends CreateFieldValues | UpdateFieldValues>({
  form,
  onSubmit,
  loading = false,
  submitText,
}: {
  form: UseFormReturn<CreateFieldValues | UpdateFieldValues>
  onSubmit: (data: CreateFieldValues | UpdateFieldValues) => void
  loading?: boolean
  submitText: string
}) => {
  const { data: tracks, isLoading: isTracksLoading } =
    api.tracks.findMany.useQuery<any, (Track & { course: { name: string } })[]>(
      { include: { course: true } }
    )
  const {
    fields: parts,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'parts',
  })
  const appendPart = () => {
    append({
      name: '',
      number: '',
      from: '',
      to: '',
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
                  items={
                    tracks?.map((t) => ({
                      ...t,
                      name: `${t.course.name}: ${t.name}`,
                    })) || []
                  }
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
        <h3 className='font-semibold'>التقسيمات</h3>
        {parts.map(({ id }, index) => (
          <div className='flex gap-4' key={id}>
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name={`parts.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الجزء أو المجلد</FormLabel>
                    <FormControl>
                      <Input placeholder='مثال: الجزء الأول' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parts.${index}.number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الجزء</FormLabel>
                    <FormControl>
                      <Input type='number' min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name={`parts.${index}.from`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>من الحديث رقم</FormLabel>
                      <FormControl>
                        <Input type='number' min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parts.${index}.to`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>إلى الحديث رقم</FormLabel>
                      <FormControl>
                        <Input type='number' min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator orientation='vertical' className='h-auto' />
            <Button
              size='icon'
              variant='destructive'
              type='button'
              onClick={() => remove(index)}
              className='flex-shrink-0 self-center'
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        ))}
        <Button type='button' onClick={appendPart}>
          إضافة جزء آخر
        </Button>
        <DialogFooter>
          <Button type='submit' loading={loading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const AddCurriculumDialog = () => {
  const queryClient = useQueryClient()
  const form = useForm<CreateFieldValues>({
    resolver: zodResolver(newCurriculumSchema),
    defaultValues: {
      parts: [{ name: '', number: '', from: '', to: '' }],
    },
  })

  const curriculumCreate = api.curricula.create.useMutation()

  const { toast } = useToast()

  const onSubmit = (data: CreateFieldValues) => {
    const t = toast({ title: 'جاري إضافة المنهج' })
    curriculumCreate
      .mutateAsync(data as z.infer<typeof newCurriculumSchema>)
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
    <CurriculumForm
      form={form}
      onSubmit={onSubmit}
      loading={curriculumCreate.isLoading}
      submitText='إضافة'
    />
  )
}

const EditCurriculumDialog = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const form = useForm<CreateFieldValues>({
    resolver: zodResolver(editCurriculumSchema),
  })

  const curriculumUpdate = api.curricula.update.useMutation()

  const { toast } = useToast()

  const onSubmit = (data: CreateFieldValues) => {
    const t = toast({ title: 'جاري إضافة المنهج' })
    curriculumUpdate
      .mutateAsync(data as z.infer<typeof editCurriculumSchema>)
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

  const {
    data: course,
    isLoading,
    error,
  } = api.curricula.findFirst.useQuery({
    where: { id },
    include: { parts: true },
  })

  useEffect(() => {
    if (course) form.reset(course)
  }, [course])

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
    <CurriculumForm
      form={form}
      onSubmit={onSubmit}
      loading={curriculumUpdate.isLoading}
      submitText='تعديل'
    />
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

type RowType = Curriculum & {
  track: Track & { course: { name: string } }
  parts: Part[]
}

const columnHelper = createColumnHelper<RowType>()

const columns = [
  columnHelper.accessor('name', {
    header: 'المنهج',
    meta: {
      className: 'text-center',
    },
  }),
  columnHelper.accessor(
    (row) => `${row.track.course.name}: ${row.track.name}`,
    {
      id: 'track',
      header: ({ column }) => {
        const { data: tracks, isLoading } = api.tracks.findMany.useQuery<
          any,
          (Track & { course: { name: string } })[]
        >({
          include: { course: true },
        })

        const filterValue = column.getFilterValue() as string | undefined

        return (
          <div className='flex items-center'>
            المسار
            <Popover>
              <PopoverTrigger className='mr-4'>
                <Button
                  size='icon'
                  variant={filterValue ? 'secondary' : 'ghost'}
                >
                  <Filter className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Combobox
                  items={[
                    { name: 'الكل', id: '' },
                    ...(tracks?.map((t) => ({
                      ...t,
                      name: `${t.course.name}: ${t.name}`,
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
    }
  ),
  columnHelper.accessor('parts', {
    header: 'الصفحات',
    cell: ({ row }) =>
      row.original.parts.map((part) => (
        <div key={part.id}>
          {part.name}: من الحديث {part.from} إلى {part.to}
        </div>
      )),
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
        <Dialog>
          <DialogTrigger>
            <Button variant='ghost' size='icon' className='hover:bg-orange-50'>
              <Edit className='h-4 w-4 text-orange-500' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>تعديل المنهج</DialogHeader>
            <EditCurriculumDialog id={row.original.id} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant='ghost' size='icon' className='hover:bg-red-50'>
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
]

const PAGE_SIZE = 25

const CurriculaPage = () => {
  const router = useRouter()

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
    if (filter.id === 'track')
      return { trackId: { equals: filter.value as string } }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: curricula, isFetching: isFetchingCurricula } =
    api.curricula.findMany.useQuery<any, RowType[]>(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        include: { track: { include: { course: true } }, parts: true },
        where: { AND: filters },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } =
    api.curricula.count.useQuery(
      { where: { AND: filters } },
      { networkMode: 'always' }
    )

  const pageCount =
    curricula !== undefined && count !== undefined
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
    onColumnFiltersChange: setColumnFilters,
  })

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

export default CurriculaPage
