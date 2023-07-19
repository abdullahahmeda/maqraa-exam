import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldPath, UseFormReturn, useForm } from 'react-hook-form'
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
import { editCourseSchema } from '~/validation/editCourseSchema'
import { Edit, Loader2, Trash } from 'lucide-react'

type CreateFieldValues = { name: string }
type UpdateFieldValues = CreateFieldValues & { id: string }
// type FieldValues = CreateFieldValues | UpdateFieldValues

const CourseForm = <T extends CreateFieldValues | UpdateFieldValues>({
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name={'name' as FieldPath<T>}
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
          <Button type='submit' loading={loading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const AddCourseDialog = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<CreateFieldValues>({
    resolver: zodResolver(newCourseSchema, {
      errorMap: customErrorMap,
    }),
  })
  const courseCreate = api.courses.create.useMutation()

  const onSubmit = (data: CreateFieldValues) => {
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
    <CourseForm
      form={form}
      onSubmit={onSubmit}
      loading={courseCreate.isLoading}
      submitText='إضافة'
    />
  )
}

const EditCourseDialog = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<CreateFieldValues>({
    resolver: zodResolver(editCourseSchema),
  })

  const {
    data: course,
    isLoading,
    error,
  } = api.courses.findFirst.useQuery({ where: { id } })

  const courseUpdate = api.courses.update.useMutation()

  useEffect(() => {
    if (course) form.reset(course)
  }, [course])

  const onSubmit = (data: CreateFieldValues) => {
    const t = toast({ title: 'جاري تعديل المقرر' })
    courseUpdate
      .mutateAsync(data as z.infer<typeof editCourseSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم تعديل المقرر بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['courses']])
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
    <CourseForm
      form={form}
      onSubmit={onSubmit}
      loading={courseUpdate.isLoading}
      submitText='تعديل'
    />
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
        <AlertDialogDescription>
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
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

const PAGE_SIZE = 25

const CoursesPage = () => {
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
    undefined,
    { networkMode: 'always' }
  )

  const pageCount =
    courses !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'المقرر',
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
            {/* <Button>عرض المناهج</Button> */}
            <Dialog>
              <DialogTrigger>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-orange-50'
                >
                  <Edit className='h-4 w-4 text-orange-500' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>تعديل المقرر</DialogHeader>
                <EditCourseDialog id={row.original.id} />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant='ghost' size='icon' className='hover:bg-red-50'>
                  <Trash className='h-4 w-4 text-red-600' />
                </Button>
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
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
  })

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
            <AddCourseDialog />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable table={table} fetching={isFetchingCourses} />
    </>
  )
}

CoursesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default CoursesPage
