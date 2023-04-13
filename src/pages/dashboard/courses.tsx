import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Fragment, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FieldErrorMessage from '~/components/field-error-message'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
import DashboardButton from '~/components/dashboard/button'
import { Course } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import { newCourseSchema } from '~/validation/newCourseSchema'
import Dialog, { DialogActions } from '~/components/dialog'

type FieldValues = {
  name: string
}

const AddCourseDialog = ({
  open,
  setOpen,
  refetch
}: {
  open: boolean
  setOpen: any
  refetch: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldsErrors },
    reset: resetForm
  } = useForm<FieldValues>({
    resolver: zodResolver(newCourseSchema, {
      errorMap: customErrorMap
    })
  })
  const courseCreate = api.courses.create.useMutation()
  const closeModal = () => setOpen(false)

  const onSubmit = (data: FieldValues) => {
    const t = toast.loading('جاري إضافة المقرر')
    courseCreate
      .mutateAsync(data)
      .then(() => {
        toast.dismiss(t)
        resetForm()
        toast.success('تم إضافة المقرر بنجاح')
        closeModal()
        refetch()
      })
      .catch(error => {
        toast.dismiss(t)
        toast.error(error.message)
      })
  }
  return (
    <Dialog open={open} setOpen={setOpen} title='إضافة مقرر'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-2'>
          <label htmlFor='name'>اسم المقرر</label>
          <input
            type='text'
            id='name'
            className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
            {...register('name')}
          />
          <FieldErrorMessage>{fieldsErrors.name?.message}</FieldErrorMessage>
        </div>
        <DialogActions>
          <DashboardButton
            type='submit'
            variant='success'
            loading={courseCreate.isLoading}
          >
            إضافة
          </DashboardButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const DeleteCourseDialog = ({
  open,
  setOpen,
  refetch,
  id
}: {
  open: boolean
  setOpen: any
  refetch: any
  id: number | null
}) => {
  const courseDelete = api.courses.delete.useMutation()
  const closeModal = () => setOpen(false)

  const deleteCourse = () => {
    const t = toast.loading('جاري حذف المقرر')
    courseDelete
      .mutateAsync({
        id: id!
      })
      .then(() => {
        toast.dismiss(t)
        toast.success('تم حذف المقرر بنجاح')
        closeModal()
        refetch()
      })
      .catch(error => {
        toast.dismiss(t)
        toast.error(error.message)
      })
  }

  return (
    <Dialog open={open} setOpen={setOpen} title='هل أنت متأكد؟'>
      <p className='mb-2'>
        هل تريد حقاً حذف هذا المقرر؟ هذا سيحذف المناهج والإختبارات المرتبطة به
        أيضاً
      </p>
      <DialogActions>
        <div className='flex items-center gap-2'>
          <DashboardButton variant='success' onClick={deleteCourse}>
            تأكيد
          </DashboardButton>
          <DashboardButton onClick={closeModal}>إلغاء</DashboardButton>
        </div>
      </DialogActions>
    </Dialog>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<
  Course & {
    questions: {
      id: number
    }[]
  }
>()

const PAGE_SIZE = 50

const CoursesPage = ({ page: initialPage }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<boolean | number>(false)

  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE
    }),
    [pageSize, pageIndex]
  )

  const {
    data,
    isLoading: isLoadingCourses,
    isRefetching: isRefetchingCourses,
    refetch,
    isLoadingError,
    isRefetchError
  } = api.courses.list.useQuery(
    {
      page: pageIndex + 1
    },
    {
      networkMode: 'always'
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.accessor('questions', {
        header: 'عدد الأسئلة',
        meta: {
          className: 'text-center'
        },
        cell: info => info.getValue().length
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <DashboardButton variant='primary'>عرض المناهج</DashboardButton>
            <DashboardButton
              variant='error'
              onClick={() => setCourseToDelete(row.original.id)}
            >
              حذف
            </DashboardButton>
          </div>
        ),
        meta: {
          className: 'text-center'
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data: data?.courses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  const openModal = () => setIsModalOpen(true)

  const changePageIndex = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    router.replace(
      {
        query: { ...router.query, page: pageIndex + 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  return (
    <>
      <Head>
        <title>المقررات</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المقررات</h2>
        <DashboardButton onClick={openModal} variant='primary'>
          إضافة مقرر
        </DashboardButton>
      </div>
      <AddCourseDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetch={refetch}
      />
      <DeleteCourseDialog
        open={!!courseToDelete}
        setOpen={setCourseToDelete}
        refetch={refetch}
        id={typeof courseToDelete === 'number' ? courseToDelete : null}
      />
      {isRefetchingCourses && (
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
      <DashboardTable
        table={table}
        isLoading={isLoadingCourses}
        isLoadingError={isLoadingError}
        refetch={refetch}
      />

      <nav className='flex justify-center'>
        <Pagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          changePageIndex={changePageIndex}
        />
      </nav>
    </>
  )
}

CoursesPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async context => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1
    }
  }
}

export default CoursesPage
