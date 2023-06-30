import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Course } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { customErrorMap } from '~/validation/customErrorMap'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { DataTable } from '~/components/ui/data-table'
import { useToast } from '~/components/ui/use-toast'
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

type FieldValues = {
  name: string
}

const AddCourseDialog = ({ refetch }: { refetch: any }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(newCourseSchema, {
      errorMap: customErrorMap,
    }),
  })
  const courseCreate = api.courses.create.useMutation()

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري إضافة المقرر' })
    courseCreate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المقرر بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['courses']])
      })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المقرر</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit' loading={courseCreate.isLoading}>
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const DeleteCourseDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const courseDelete = api.courses.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteCourse = () => {
    const t = toast({ title: 'جاري حذف المقرر' })
    courseDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف المقرر بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['courses']])
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
        <AlertDialogAction onClick={deleteCourse}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<Course>()

const PAGE_SIZE = 1

const CoursesPage = ({ page: initialPage }: Props) => {
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
    data: courses,
    isFetching: isFetchingCourses,
    refetch,
  } = api.courses.findMany.useQuery(
    {
      take: pageSize,
      skip: pageIndex * pageSize,
    },
    { networkMode: 'always' }
  )

  const { data: count, isLoading: isCountLoading } = api.courses.count.useQuery(
    {},
    { networkMode: 'always' }
  )

  const pageCount =
    courses !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

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
      // columnHelper.accessor('questions', {
      //   header: 'عدد الأسئلة',
      //   meta: {
      //     className: 'text-center',
      //   },
      //   cell: (info) => info.getValue().length,
      // }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <Button>عرض المناهج</Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant='destructive'>حذف</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteCourseDialog id={row.original.id} />
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
    data: courses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination },
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
        <title>المقررات</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المقررات</h2>
        <Dialog>
          <DialogTrigger>
            <Button>إضافة مقرر</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>إضافة مقرر</DialogHeader>
            <AddCourseDialog refetch={refetch} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable table={table} fetching={isFetchingCourses} />
    </>
  )
}

CoursesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default CoursesPage
