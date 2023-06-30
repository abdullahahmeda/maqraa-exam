import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '~/components/ui/button'
import { Question, User } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { UserRole } from '~/constants'
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import { enUserRoleToAr } from '~/utils/users'
import { updateUserSchema } from '~/validation/updateUserSchema'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { newUserSchema } from '~/validation/newUserSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
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
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '~/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

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
  id,
}: {
  open: boolean
  setOpen: any
  refetch: any
  id: string | null
}) => {
  const form = useForm<EditUserFieldValues>({
    resolver: zodResolver(updateUserSchema, {
      errorMap: customErrorMap,
    }),
  })
  const { isLoading: isLoadingUser } = api.users.get.useQuery(
    {
      id: id!,
    },
    {
      enabled: id != null,
      onSuccess: (user) => {
        if (user)
          form.reset({
            id: user.id,
            name: user.name!,
            email: user.email!,
            role: user.role! as UserRole,
          })
      },
    }
  )
  const userUpdate = api.users.update.useMutation()
  const closeModal = () => setOpen(false)

  const onSubmit = (data: EditUserFieldValues) => {
    userUpdate
      .mutateAsync({
        ...data,
        role: data.role as UserRole,
      })
      .then(() => {
        toast.success('تم تعديل بيانات المستخدم بنجاح')
        closeModal()
        refetch()
      })
      .catch((error) => {
        form.setError('root.serverError', {
          message: error.message || 'حدث خطأ غير متوقع',
        })
      })
  }

  return (
    <>
      {isLoadingUser && id != null ? (
        <div className='flex items-center justify-center gap-2 text-center'>
          <Spinner />
          <p>جاري التحميل</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <input type='hidden' {...form.register('id')} />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
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
                  <FormLabel>الصلاحيات</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر الصلاحية' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.STUDENT}>طالب</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>أدمن</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FieldErrorMessage className='mb-2'>
              {fieldsErrors.root?.serverError?.message}
            </FieldErrorMessage> */}
            <DialogFooter>
              <Button type='submit' loading={userUpdate.isLoading}>
                تعديل
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </>
  )
}

type AddUsersSheetFieldValues = {
  url: string
  sheet: string
}

const AddUsersFromSheetForm = () => {
  const form = useForm<AddUsersSheetFieldValues>({
    resolver: zodResolver(importUsersSchema, {
      errorMap: customErrorMap,
    }),
  })

  const usersImport = api.sheets.importUsers.useMutation()

  const queryClient = useQueryClient()

  const {
    isFetching: isFetchingSheets,
    data: sheets,
    refetch: refetchSheets,
  } = api.sheets.listSheets.useQuery(
    {
      url: form.getValues('url'),
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      onError: (error) => {
        form.setError('url', {
          message: error.message,
        })
      },
    }
  )

  const updateSpreadsheet = async () => {
    const isValidUrl = await form.trigger('url')
    if (!isValidUrl) return

    refetchSheets()
  }

  const onSubmit = (data: AddUsersSheetFieldValues) => {
    const t = toast.loading('جاري إضافة الطلبة')
    usersImport
      .mutateAsync(data as z.infer<typeof importUsersSchema>)
      .then(() => {
        toast.dismiss(t)
        form.reset()
        toast.success('تم إضافة الطلبة بنجاح')
      })
      .catch((error) => {
        toast.dismiss(t)
        toast.error(error.message)
      })
      .finally(() => {
        queryClient.invalidateQueries([['sheets']])
      })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الإكسل الشيت</FormLabel>
              <FormControl>
                <div className='flex gap-1'>
                  <Input type='url' {...field} />
                  <Button
                    type='button'
                    onClick={updateSpreadsheet}
                    loading={isFetchingSheets}
                  >
                    تحديث
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sheet'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الورقة</FormLabel>
              <Select
                disabled={!sheets || sheets.length === 0}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر الورقة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sheets?.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit' loading={usersImport.isLoading}>
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

type AddUsersSingleFieldValues = {
  name: string
  email: string
  role: UserRole
}

const AddUsersDialog = () => {
  const [type, setType] = useState('SINGLE')
  const queryClient = useQueryClient()

  const form = useForm<AddUsersSingleFieldValues>({
    defaultValues: {
      role: UserRole.STUDENT,
    },
    resolver: zodResolver(newUserSchema, {
      errorMap: customErrorMap,
    }),
  })

  const userCreate = api.users.create.useMutation()

  const onSubmit = (data: AddUsersSingleFieldValues) => {
    const t = toast.loading('جاري إضافة المستخدم')
    userCreate
      .mutateAsync(data as z.infer<typeof newUserSchema>)
      .then(() => {
        toast.dismiss(t)
        form.reset()
        toast.success('تم إضافة المستخدم بنجاح')
      })
      .catch((error) => {
        toast.dismiss(t)
        toast.error(error.message)
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }

  return (
    <Tabs defaultValue='single'>
      <TabsList>
        <TabsTrigger value='single'>مستخدم واحد</TabsTrigger>
        <TabsTrigger value='sheet'>من اكسل شيت</TabsTrigger>
      </TabsList>
      <TabsContent value='single'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
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
                  <FormLabel>الصلاحيات</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر الصلاحية' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.STUDENT}>طالب</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>أدمن</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' loading={userCreate.isLoading}>
                إضافة
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value='sheet'>
        <AddUsersFromSheetForm />
      </TabsContent>
    </Tabs>
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
    isLoading: isLoadingQuestions,
    isRefetching: isRefetchingQuestions,
    refetch,
    isLoadingError,
    isRefetchError,
  } = api.users.list.useQuery(
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
      columnHelper.accessor('email', {
        header: 'البريد الإلكتروني',
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
      columnHelper.accessor('role', {
        header: 'الصلاحيات',
        cell: (info) => (
          <Badge
          // variant={info.getValue() === UserRole.ADMIN ? 'success' : 'warning'}
          >
            {enUserRoleToAr(info.getValue() || '')}
          </Badge>
        ),
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <Button>عرض</Button>
            <Button onClick={() => setUserToEdit(row.original.id)}>
              تعديل
            </Button>
          </div>
        ),
      }),
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
      pagination,
    },
    onPaginationChange: setPagination,
  })

  const openModal = () => setIsModalOpen(true)

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
        <title>المستخدمون</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المستخدمون</h2>
        <Dialog>
          <DialogTrigger>
            <Button>إضافة مستخدمين</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>إضافة مستخدمين</DialogHeader>
            <AddUsersDialog />
          </DialogContent>
        </Dialog>
      </div>
      {/* <EditUserDialog
      title='تعديل بيانات المستخدم'
        open={!!userToEdit}
        setOpen={setUserToEdit}
        refetch={refetch}
        id={typeof userToEdit === 'string' ? userToEdit : null}
      /> */}
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
    </>
  )
}

UsersPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1,
    },
  }
}

export default UsersPage
