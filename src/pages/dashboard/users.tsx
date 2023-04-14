import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FieldErrorMessage from '~/components/field-error-message'
import { api } from '~/utils/api'
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
import { UserRole } from '~/constants'
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import { enUserRoleToAr } from '~/utils/users'
import Dialog, { DialogActions } from '~/components/dialog'
import { updateUserSchema } from '~/validation/updateUserSchema'
import { importUsersSchema } from '~/validation/importUsersSchema'

type EditUserFieldValues = {
  id: string
  name: string
  email: string
  role: string
}

const EditUserDialog = ({
  open,
  setOpen,
  refetch,
  id
}: {
  open: boolean
  setOpen: any
  refetch: any
  id: string | null
}) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    setError,
    formState: { errors: fieldsErrors }
  } = useForm<EditUserFieldValues>({
    resolver: zodResolver(updateUserSchema, {
      errorMap: customErrorMap
    })
  })
  const { isLoading: isLoadingUser } = api.users.get.useQuery(
    {
      id: id!
    },
    {
      enabled: id != null,
      onSuccess: user => {
        if (user)
          resetForm({
            id: user.id,
            name: user.name!,
            email: user.email!,
            role: user.role! as UserRole
          })
      }
    }
  )
  const userUpdate = api.users.update.useMutation()
  const closeModal = () => setOpen(false)

  const onSubmit = (data: EditUserFieldValues) => {
    userUpdate
      .mutateAsync({
        ...data,
        role: data.role as UserRole
      })
      .then(() => {
        toast.success('تم تعديل بيانات المستخدم بنجاح')
        closeModal()
        refetch()
      })
      .catch(error => {
        setError('root.serverError', {
          message: error.message || 'حدث خطأ غير متوقع'
        })
      })
  }

  return (
    <Dialog open={open} setOpen={setOpen} title='تعديل بيانات المستخدم'>
      {isLoadingUser && id != null ? (
        <div className='flex items-center justify-center gap-2 text-center'>
          <Spinner />
          <p>جاري التحميل</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type='hidden' {...register('id')} />
          <div className='mb-2'>
            <label htmlFor='name'>الاسم</label>
            <input
              type='text'
              id='name'
              className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
              {...register('name')}
            />
            <FieldErrorMessage>{fieldsErrors.name?.message}</FieldErrorMessage>
          </div>
          <div className='mb-2'>
            <label htmlFor='email'>البريد الإلكتروني</label>
            <input
              type='email'
              id='email'
              className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
              {...register('email')}
            />
            <FieldErrorMessage>{fieldsErrors.email?.message}</FieldErrorMessage>
          </div>
          <div className='mb-2'>
            <label htmlFor='name'>الصلاحيات</label>
            <Select className='w-full' id='role' {...register('role')}>
              <option value={UserRole.STUDENT}>طالب</option>
              <option value={UserRole.ADMIN}>أدمن</option>
            </Select>
            <FieldErrorMessage>{fieldsErrors.role?.message}</FieldErrorMessage>
          </div>
          <FieldErrorMessage className='mb-2'>
            {fieldsErrors.root?.serverError?.message}
          </FieldErrorMessage>
          <DialogActions>
            <DashboardButton
              type='submit'
              variant='success'
              loading={userUpdate.isLoading}
            >
              تعديل
            </DashboardButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}

type AddUsersFieldValues = {
  url: string
  sheet: string
}

const AddUsersDialog = ({
  open,
  setOpen,
  refetch: refetchUsers
}: {
  open: boolean
  setOpen: any
  refetch: any
}) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    trigger,
    getValues,
    setError,
    formState: { errors: fieldsErrors }
  } = useForm<AddUsersFieldValues>({
    resolver: zodResolver(importUsersSchema, {
      errorMap: customErrorMap
    })
  })

  const closeModal = () => setOpen(false)

  const usersImport = api.sheets.importUsers.useMutation()

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

  const onSubmit = (data: AddUsersFieldValues) => {
    const t = toast.loading('جاري إضافة الطلبة')
    usersImport
      .mutateAsync(data as z.infer<typeof importUsersSchema>)
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
    <Dialog open={open} setOpen={setOpen} title='إضافة مستخدمين'>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <FieldErrorMessage>{fieldsErrors.url?.message}</FieldErrorMessage>
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
          <FieldErrorMessage>{fieldsErrors.sheet?.message}</FieldErrorMessage>
        </div>
        <DialogActions>
          <DashboardButton
            type='submit'
            variant='success'
            loading={usersImport.isLoading}
          >
            إضافة
          </DashboardButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<User>()

const PAGE_SIZE = 50

const UsersPage = ({ page: initialPage }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<boolean | string>(false)

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
    refetch,
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

  const columns = useMemo(
    () => [
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
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <DashboardButton variant='primary'>عرض</DashboardButton>
            <DashboardButton
              variant='warning'
              onClick={() => setUserToEdit(row.original.id)}
            >
              تعديل
            </DashboardButton>
          </div>
        )
      })
    ],
    []
  )

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
      <AddUsersDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetch={refetch}
      />
      <EditUserDialog
        open={!!userToEdit}
        setOpen={setUserToEdit}
        refetch={refetch}
        id={typeof userToEdit === 'string' ? userToEdit : null}
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
