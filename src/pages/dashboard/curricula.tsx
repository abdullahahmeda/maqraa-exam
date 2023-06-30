import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
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
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
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

type FieldValues = {
  course: undefined | string
  name: string
  pages: {
    from: number
    to: number
  }
}

const AddCurriculumDialog = () => {
  const queryClient = useQueryClient()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newCurriculumSchema, {
      errorMap: customErrorMap,
    }),
  })
  const curriculumCreate = api.curricula.create.useMutation()

  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.fetchAll.useQuery()

  const onSubmit = (data: FieldValues) => {
    const t = toast.loading('جاري إضافة المنهج')
    curriculumCreate
      .mutateAsync(data as z.infer<typeof newCurriculumSchema>)
      .then(() => {
        toast.dismiss(t)
        form.reset()
        toast.success('تم إضافة المنهج بنجاح')
      })
      .catch((error) => {
        toast.dismiss(t)
        toast.error(error.message)
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
          name='course'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المقرر</FormLabel>
              <Select
                disabled={!courses || courses.length === 0}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger loading={isCoursesLoading}>
                    <SelectValue placeholder='اختر المقرر' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent loading={isCoursesLoading}>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <FormField
          control={form.control}
          name='pages.from'
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
          name='pages.to'
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
        <DialogFooter>
          <Button type='submit' loading={curriculumCreate.isLoading}>
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const DeleteCurriculumDialog = ({ id }: { id: number | null }) => {
  const curriculumDelete = api.curricula.delete.useMutation()

  const queryClient = useQueryClient()

  const deleteCurriculum = () => {
    const t = toast.loading('جاري حذف المنهج')
    curriculumDelete
      .mutateAsync({
        id: id!,
      })
      .then(() => {
        toast.dismiss(t)
        toast.success('تم حذف المنهج بنجاح')
      })
      .catch((error) => {
        toast.dismiss(t)
        toast.error(error.message)
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

const columnHelper = createColumnHelper<
  Curriculum & {
    course: {
      name: string
    }
  }
>()

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

  const {
    data,
    isLoading: isLoadingCurricula,
    isRefetching: isRefetchingCurricula,
    refetch,
    isLoadingError,
    isRefetchError,
  } = api.curricula.list.useQuery(
    {
      page: pageIndex + 1,
    },
    {
      networkMode: 'always',
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('course.name', {
        header: 'المقرر',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.display({
        id: 'pages',
        header: 'الصفحات',
        cell: (info) =>
          'من ' +
          info.row.original.fromPage +
          ' إلى ' +
          info.row.original.toPage,
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
                <Button
                  variant='destructive'
                  // onClick={() => setCurriculumToDelete(row.original.id)}
                >
                  حذف
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
    data: data?.curricula || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  const changePageIndex = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    router.replace(
      {
        query: { ...router.query, page: pageIndex + 1 },
      },
      undefined,
      {
        shallow: true,
      }
    )
  }

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
      {isRefetchingCurricula && (
        <span className='mt-2 flex items-center gap-1 rounded bg-blue-200 p-2'>
          <Spinner />
          جاري تحديث البيانات...
        </span>
      )}
      {isRefetchError && (
        <span className='mt-2 flex items-center rounded bg-red-200 p-2'>
          حدث خطأ أثناء تحديث البيانات، تأكد من اتصال الانترنت
        </span>
      )}
      <DataTable
        table={table}
        // isLoading={isLoadingCurricula}
        // isLoadingError={isLoadingError}
        // refetch={refetch}
      />
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
