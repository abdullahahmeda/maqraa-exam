import Head from 'next/head'
import DashboardLayout from '../../components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FieldErrorMessage from '../../components/field-error-message'
import { api } from '../../utils/api'
import {
  enDifficultyToAr,
  enStyleToAr,
  enTypeToAr,
  getDifficultyVariant
} from '../../utils/questions'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
import DashboardButton from '../../components/dashboard/button'
import Badge from '../../components/badge'
import { Course } from '@prisma/client'
import Spinner from '../../components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import Pagination from '../../components/pagination'
import { customErrorMap } from '../../validation/customErrorMap'
import DashboardTable from '../../components/dashboard/table'
import { newCourseSchema } from '../../validation/newCourseSchema'

type FieldValues = {
  name: string
}

const AddCourseModal = ({
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

  const closeModal = () => setOpen(false)

  const courseCreate = api.courses.create.useMutation()

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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-[100] overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                as='form'
                onSubmit={handleSubmit(onSubmit)}
                className='relative w-full transform overflow-hidden rounded-lg bg-white text-right shadow-xl transition-all sm:my-8 sm:max-w-lg'
              >
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='mb-4 flex items-center justify-between'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      إضافة مقرر
                    </Dialog.Title>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='text-gray-600 hover:text-gray-700'
                    >
                      <MdClose size={20} />
                    </button>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='name'>اسم المقرر</label>
                    <input
                      type='text'
                      id='name'
                      className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
                      {...register('name')}
                    />
                    <FieldErrorMessage>
                      {fieldsErrors.name?.message}
                    </FieldErrorMessage>
                  </div>
                </div>
                <div className='flex bg-gray-50 py-3 px-4'>
                  <DashboardButton
                    type='submit'
                    variant='success'
                    loading={courseCreate.isLoading}
                  >
                    إضافة
                  </DashboardButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
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

const columns = [
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
    cell: () => (
      <div className='flex justify-center gap-2'>
        <DashboardButton variant='primary'>عرض المناهج</DashboardButton>
        <DashboardButton variant='error'>حذف</DashboardButton>
      </div>
    ),
    meta: {
      className: 'text-center'
    }
  })
]

const PAGE_SIZE = 50

const CoursesPage = ({ page: initialPage }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      networkMode: 'always',
      trpc: {
        ssr: false
      }
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

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
      <AddCourseModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetch={refetch}
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
