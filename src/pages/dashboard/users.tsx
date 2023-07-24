import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { User, UserRole } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import { enUserRoleToAr, userRoleMapping } from '~/utils/users'
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
import { DataTable } from '~/components/ui/data-table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Edit, Filter, Eye } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { getServerAuthSession } from '~/server/auth'

type AddUsersSingleFieldValues = {
  name: string
  email: string
  role: UserRole | string
}

type EditUserFieldValues = { id: string } & AddUsersSingleFieldValues

type FormValues = AddUsersSingleFieldValues | EditUserFieldValues

type UserFormProps = {
  form: UseFormReturn<AddUsersSingleFieldValues | EditUserFieldValues>
  onSubmit: (data: AddUsersSingleFieldValues | EditUserFieldValues) => void
  isLoading?: boolean
  submitText: string
}

const UserForm = <T,>({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: UserFormProps) => {
  return (
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
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الصلاحيات</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر الصلاحية' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(userRoleMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

const EditUserDialog = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<EditUserFieldValues>({
    resolver: zodResolver(updateUserSchema),
  })
  const { isLoading: isLoadingUser } = api.users.findFirstOrThrow.useQuery(
    { where: { id } },
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

  const onSubmit = (data: EditUserFieldValues) => {
    userUpdate
      .mutateAsync({
        ...data,
        role: data.role as UserRole,
      })
      .then(() => {
        toast({ title: 'تم تعديل بيانات المستخدم بنجاح' })
      })
      .catch((error) => {
        form.setError('root.serverError', {
          message: error.message || 'حدث خطأ غير متوقع',
        })
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }

  if (isLoadingUser)
    return (
      <div className='flex items-center justify-center gap-2 text-center'>
        <Spinner />
        <p>جاري التحميل</p>
      </div>
    )

  return (
    <UserForm
      form={form as any}
      onSubmit={onSubmit as any}
      submitText='تعديل'
      isLoading={userUpdate.isLoading}
    />
  )
}

type AddUsersSheetFieldValues = {
  url: string
  sheet: string
  cycleId: string
}

const AddUsersFromSheetForm = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<AddUsersSheetFieldValues>({
    resolver: zodResolver(importUsersSchema),
  })

  const { toast } = useToast()

  const usersImport = api.users.importStudents.useMutation()

  const queryClient = useQueryClient()

  const { data: cycles, isLoading: isCyclesLoading } =
    api.cycles.findMany.useQuery({})

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
    const t = toast({ title: 'جاري إضافة الطلبة' })
    usersImport
      .mutateAsync(data as z.infer<typeof importUsersSchema>)
      .then(() => {
        t.dismiss()
        form.reset()
        toast({ title: 'تم إضافة الطلبة بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
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
                value={field.value}
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
        <FormField
          control={form.control}
          name='cycleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدورة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger loading={isCyclesLoading}>
                    <SelectValue placeholder='اختر الدورة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
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

const AddUsersDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<AddUsersSingleFieldValues>({
    defaultValues: { role: UserRole.STUDENT },
    resolver: zodResolver(newUserSchema),
  })

  const userCreate = api.users.create.useMutation()

  const onSubmit = (data: AddUsersSingleFieldValues) => {
    const t = toast({ title: 'جاري إضافة المستخدم' })
    userCreate
      .mutateAsync(data as z.infer<typeof newUserSchema>)
      .then(() => {
        t.dismiss()
        form.reset()
        toast({ title: 'تم إضافة المستخدم بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }

  return (
    <Tabs defaultValue='single' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='single'>مستخدم واحد</TabsTrigger>
        <TabsTrigger value='sheet'>من اكسل شيت (طلاب فقط)</TabsTrigger>
      </TabsList>
      <TabsContent value='single'>
        <UserForm
          form={form}
          onSubmit={onSubmit}
          isLoading={userCreate.isLoading}
          submitText='إضافة'
        />
      </TabsContent>
      <TabsContent value='sheet'>
        <AddUsersFromSheetForm setDialogOpen={setDialogOpen} />
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

  const { data: users, isFetching: isFetchingUsers } =
    api.users.findMany.useQuery(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        where: { AND: filters },
        include: { cycles: true, cycle: true, course: true },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.users.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    users !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

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
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined
          return (
            <div className='flex items-center'>
              الصلاحيات
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
                  <Select
                    value={filterValue === undefined ? '' : filterValue}
                    onValueChange={column.setFilterValue}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>الكل</SelectItem>
                      {Object.entries(userRoleMapping).map(([label, value]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            </div>
          )
        },
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
      // columnHelper.accessor('cycle.name', {
      //   header: ({ column }) => {
      //     const filterValue = column.getFilterValue() as string | undefined
      //     return (
      //       <div className='flex items-center'>
      //         الدورة
      //         <Popover>
      //           <PopoverTrigger className='mr-4'>
      //             <Button
      //               size='icon'
      //               variant={filterValue ? 'secondary' : 'ghost'}
      //             >
      //               <Filter className='h-4 w-4' />
      //             </Button>
      //           </PopoverTrigger>
      //           <PopoverContent>
      //             <Select
      //               value={filterValue === undefined ? '' : filterValue}
      //               onValueChange={column.setFilterValue}
      //             >
      //               <SelectTrigger>
      //                 <SelectValue />
      //               </SelectTrigger>
      //               <SelectContent>
      //                 <SelectItem value=''>الكل</SelectItem>
      //                 {Object.entries(userRoleMapping).map(([label, value]) => (
      //                   <SelectItem key={value} value={value}>
      //                     {label}
      //                   </SelectItem>
      //                 ))}
      //               </SelectContent>
      //             </Select>
      //           </PopoverContent>
      //         </Popover>
      //       </div>
      //     )
      //   },
      //   cell: (info) => (
      //     <Badge
      //     // variant={info.getValue() === UserRole.ADMIN ? 'success' : 'warning'}
      //     >
      //       {enUserRoleToAr(info.getValue() || '')}
      //     </Badge>
      //   ),
      //   meta: {
      //     className: 'text-center',
      //   },
      // }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            <Button size='icon' variant='ghost'>
              <Eye className='h-4 w-4' />
            </Button>
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
                <EditUserDialog id={row.original.id} />
              </DialogContent>
            </Dialog>
          </div>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: users || [],
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
        <title>المستخدمون</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المستخدمون</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>إضافة مستخدمين</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>إضافة مستخدمين</DialogHeader>
            <AddUsersDialog setDialogOpen={setDialogOpen} />
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
      <DataTable table={table} fetching={isFetchingUsers} />
    </>
  )
}

UsersPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== UserRole.ADMIN) return { notFound: true }

  return {
    props: {
      session,
    },
  }
}

export default UsersPage
