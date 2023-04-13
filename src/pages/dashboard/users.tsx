import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import FieldErrorMessage from '~/components/field-error-message'
import { api } from '~/utils/api'
import {
  enDifficultyToAr,
  enStyleToAr,
  enTypeToAr,
  getDifficultyVariant
} from '~/utils/questions'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
import DashboardButton from '~/components/dashboard/button'
import Badge from '~/components/badge'
import { Question, User } from '@prisma/client'
import Select from '~/components/select'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { QuestionDifficulty, QuestionType, UserRole } from '~/constants'
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import { enUserRoleToAr } from '~/utils/users'

type FieldValues = {
  url: string
  sheet: string
}

const defaultValues: FieldValues = {
  url: '',
  sheet: ''
}

const AddUsersModal = ({
  open,
  setOpen,
  refetchUsers
}: {
  open: boolean
  setOpen: any
  refetchUsers: any
}) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    trigger,
    getValues,
    setError,
    formState: { errors: fieldsErrors }
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(importQuestionsSchema, {
      errorMap: customErrorMap
    })
  })

  const closeModal = () => setOpen(false)

  const studentsImport = api.sheets.importQuestions.useMutation()

  const {
    isFetching: isFetchingSheets,
    data: sheets,
    refetch: refetchSheets
  } = api.sheets.listSheets.useQuery(
    {
      url: getValues('url')
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      onError: error => {
        setError('url', {
          message: error.message
        })
      }
    }
  )

  const updateSpreadsheet = async () => {
    const isValidUrl = await trigger('url')
    if (!isValidUrl) return

    refetchSheets()
  }

  const onSubmit = (data: FieldValues) => {
    const t = toast.loading('جاري إضافة الطلبة')
    studentsImport
      .mutateAsync(data as z.infer<typeof importQuestionsSchema>)
      .then(() => {
        toast.dismiss(t)
        resetForm()
        toast.success('تم إضافة الطلبة بنجاح')
        closeModal()
        refetchUsers()
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
                      إضافة مستخدمين
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
                    <label htmlFor='url'>رابط الإكسل الشيت</label>
                    <div className='flex gap-1'>
                      <input
                        type='url'
                        id='url'
                        className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
                        {...register('url')}
                      />
                      <DashboardButton
                        type='button'
                        onClick={updateSpreadsheet}
                        loading={isFetchingSheets}
                      >
                        تحديث
                      </DashboardButton>
                    </div>
                    <FieldErrorMessage>
                      {fieldsErrors.url?.message}
                    </FieldErrorMessage>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='sheet'>الورقة</label>
                    <Select
                      disabled={!sheets || sheets.length === 0}
                      className='w-full'
                      id='sheet'
                      {...register('sheet')}
                    >
                      {!!sheets && sheets?.length > 0 ? (
                        <>
                          <option value=''>اختر الورقة</option>
                          {sheets.map(sheet => (
                            <option key={sheet} value={sheet}>
                              {sheet}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option>لا يوجد خيارات</option>
                      )}
                    </Select>
                    <FieldErrorMessage>
                      {fieldsErrors.sheet?.message}
                    </FieldErrorMessage>
                  </div>
                </div>
                <div className='flex bg-gray-50 py-3 px-4'>
                  <DashboardButton
                    type='submit'
                    variant='success'
                    loading={studentsImport.isLoading}
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

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('email', {
    header: 'البريد الإلكتروني',
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
  columnHelper.accessor('role', {
    header: 'الصلاحيات',
    cell: info => (
      <Badge
        text={enUserRoleToAr(info.getValue() || '')}
        variant={info.getValue() === UserRole.ADMIN ? 'success' : 'warning'}
      />
    ),
    meta: {
      className: 'text-center'
    }
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <div className='flex justify-center'>
        <DashboardButton variant='primary'>عرض</DashboardButton>
      </div>
    )
  })
]

const PAGE_SIZE = 50

const UsersPage = ({ page: initialPage }: Props) => {
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
    isLoading: isLoadingQuestions,
    isRefetching: isRefetchingQuestions,
    refetch: refetchQuestions,
    isLoadingError,
    isRefetchError
  } = api.users.list.useQuery(
    {
      page: pageIndex + 1
    },
    {
      networkMode: 'always'
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const table = useReactTable({
    data: data?.users || [],
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
        <title>المستخدمون</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المستخدمون</h2>
        <DashboardButton onClick={openModal} variant='primary'>
          إضافة مستخدمين
        </DashboardButton>
      </div>
      <AddUsersModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchUsers={refetchQuestions}
      />
      {isRefetchingQuestions && (
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
        isLoading={isLoadingQuestions}
        isLoadingError={isLoadingError}
        refetch={refetchQuestions}
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

UsersPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async context => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1
    }
  }
}

export default UsersPage
